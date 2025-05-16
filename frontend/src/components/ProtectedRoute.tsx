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

  // Store the complete original URL for redirection
  const originalPath = pathname + search;

  useEffect(() => {
    const extractAndSaveConfig = (): string | null => {
      const params = new URLSearchParams(search);
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
  }, [setCurrentUser, search, saveConfig, navigate, pathname]);

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  if (authStatus === "unauthenticated") {
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(originalPath)}`}
      />
    );
  }

  if (authStatus === "unverified") {
    return (
      <Navigate
        to={`/auth/verify-email?redirect=${encodeURIComponent(originalPath)}`}
      />
    );
  }

  return <>{children}</>;
};
