import { Navigate, useLocation, useNavigate } from "@tanstack/react-router";
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
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const { saveConfig } = useMatchConfig();
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated" | "unverified"
  >("loading");
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  useEffect(() => {
    // Extract and save match config from URL parameters if they exist
    const extractAndSaveConfig = () => {
      const params = new URLSearchParams(search);
      let hasGameMode = false;

      if (params.has("gameMode")) {
        const mode = params.get("gameMode")! as GameMode;
        setGameMode(mode);
        hasGameMode = true;
      }

      if (params.size > 0) {
        const urlConfig: Partial<MatchConfigI> = {
          ...(params.has("gameMode") && {
            gameMode: params.get("gameMode")! as GameMode,
          }),
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
      }

      return hasGameMode;
    };

    const checkAuth = async () => {
      try {
        // First attempt to get user
        const user = await getUser();
        setCurrentUser(user);

        // Extract and save config from URL
        const hasGameMode = extractAndSaveConfig();

        if (!user?.isVerified) {
          setAuthStatus("unverified");
          return;
        }

        setAuthStatus("authenticated");

        // If gameMode exists, redirect directly to the game
        if (hasGameMode && gameMode) {
          navigate({ to: `/game/${gameMode}` });
          return;
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            // Attempt to refresh token
            await refreshToken();

            // Retry getting user with new token
            const user = await getUser();
            setCurrentUser(user);

            // Re-check config after refresh
            const hasGameMode = extractAndSaveConfig();

            setAuthStatus("authenticated");

            if (hasGameMode && gameMode) {
              navigate({ to: `/game/${gameMode}` });
              return;
            }
          } catch (refreshError) {
            setAuthStatus("unauthenticated");
          }
        } else {
          setAuthStatus("unauthenticated");
        }
      }
    };

    checkAuth();
  }, [setCurrentUser, search, saveConfig, gameMode, navigate]);

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  if (authStatus === "unauthenticated") {
    // If gameMode exists, redirect to login with just the game path (no query params)
    const redirectPath = gameMode ? `/game/${gameMode}` : pathname;
    const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
      redirectPath
    )}`;
    return <Navigate to={redirectUrl} />;
  }

  if (authStatus === "unverified") {
    const redirectPath = gameMode ? `/game/${gameMode}` : pathname;
    const redirectUrl = `/auth/verify-email?redirect=${encodeURIComponent(
      redirectPath
    )}`;
    return <Navigate to={redirectUrl} />;
  }

  return <>{children}</>;
};
