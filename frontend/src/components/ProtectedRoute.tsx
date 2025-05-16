import { useLocation, useNavigate } from "@tanstack/react-router";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const { saveConfig } = useMatchConfig();

  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated" | "unverified"
  >("loading");

  useEffect(() => {
    const extractAndSaveConfig = (): string | null => {
      const params = new URLSearchParams(location.search);
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
  }, [
    setCurrentUser,
    location.search,
    saveConfig,
    navigate,
    location.pathname,
  ]);

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  if (authStatus === "unauthenticated") {
    // Instead of using Navigate component with redirect params, use navigate function directly
    useEffect(() => {
      // Create a clean URL string for the redirect parameter
      const redirectPath = `${location.pathname}${location.search}`;

      // Navigate programmatically with search params
      window.location.href = `/auth/login?redirect=${encodeURIComponent(
        redirectPath
      )}`;
    }, []);

    // Return loading while the redirect happens
    return <LoadingScreen />;
  }

  if (authStatus === "unverified") {
    // Instead of using Navigate component with redirect params, use navigate function directly
    useEffect(() => {
      // Create a clean URL string for the redirect parameter
      const redirectPath = `${location.pathname}${location.search}`;

      // Navigate programmatically with search params
      window.location.href = `/auth/verify-email?redirect=${encodeURIComponent(
        redirectPath
      )}`;
    }, []);

    // Return loading while the redirect happens
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
