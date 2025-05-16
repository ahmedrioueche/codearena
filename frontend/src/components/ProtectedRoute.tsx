import { useNavigate } from "@tanstack/react-router";
import { FC, ReactNode, useEffect, useState } from "react";
import { getUser } from "../api/user";
import { useAppContext } from "../context/AppContext";
import LoadingScreen from "./LoadingPage";
import { refreshToken } from "../api/auth";
import { useMatchConfig } from "../app/hooks/useMatchConfig";
import { DifficultyLevel, GameMode, MatchConfigI } from "../types/game/game";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const { saveConfig } = useMatchConfig();

  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated" | "unverified"
  >("loading");

  // This is a critical function - define it outside useEffect to avoid closure issues
  const handleRedirect = (destination: "login" | "verify-email") => {
    // Use the browser's raw URL rather than the router's location object
    // This avoids any potential object serialization issues
    const rawUrl = window.location.pathname + window.location.search;

    // Create the redirect URL based on the destination
    const redirectUrl =
      destination === "login"
        ? `/auth/login?redirect=${encodeURIComponent(rawUrl)}`
        : `/auth/verify-email?redirect=${encodeURIComponent(rawUrl)}`;

    // Use replace to avoid browser history issues
    window.location.replace(redirectUrl);
  };

  // Handle redirects based on auth status
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      handleRedirect("login");
    } else if (authStatus === "unverified") {
      handleRedirect("verify-email");
    }
  }, [authStatus]);

  // Check authentication on component mount
  useEffect(() => {
    const extractAndSaveConfig = (): string | null => {
      // Use URLSearchParams with the raw search string to ensure correct parsing
      const params = new URLSearchParams(window.location.search);
      const gameMode = params.get("gameMode") as GameMode | null;

      const urlConfig: Partial<MatchConfigI> = {
        ...(gameMode ? { gameMode } : {}),
        ...(params.has("language") && { language: params.get("language")! }),
        ...(params.has("difficultyLevel") && {
          difficultyLevel: params.get("difficultyLevel")! as DifficultyLevel,
        }),
        ...(params.has("timeLimit") && {
          timeLimit: params.get("timeLimit")!,
        }),
        ...(params.has("topics") && {
          topics: params.get("topics")!.split(","),
        }),
      };

      if (Object.keys(urlConfig).length > 0) {
        saveConfig(urlConfig);
      }

      return gameMode;
    };

    const checkAuth = async () => {
      const gameMode = extractAndSaveConfig();

      try {
        const user = await getUser();
        setCurrentUser(user);

        if (!user?.isVerified) {
          setAuthStatus("unverified");
          return;
        }

        setAuthStatus("authenticated");

        // Only navigate to game mode when authentication is successful
        if (gameMode) {
          navigate({ to: `/game/${gameMode}` });
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            await refreshToken();
            const user = await getUser();
            setCurrentUser(user);
            setAuthStatus("authenticated");

            if (gameMode) {
              navigate({ to: `/game/${gameMode}` });
            }
          } catch {
            setAuthStatus("unauthenticated");
          }
        } else {
          setAuthStatus("unauthenticated");
        }
      }
    };

    checkAuth();
  }, [setCurrentUser, saveConfig, navigate]);

  // Return loading screen for any non-authenticated state
  if (authStatus !== "authenticated") {
    return <LoadingScreen />;
  }

  // If authenticated, render children
  return <>{children}</>;
};
