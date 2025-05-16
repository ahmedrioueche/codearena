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
  const { search } = useLocation();
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();
  const { saveConfig } = useMatchConfig();
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated" | "unverified"
  >("loading");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const gameMode = params.get("gameMode");
    console.log("gameMode in useEffect", gameMode);

    // Save all config parameters to localStorage
    if (params.size > 0) {
      const config: Partial<MatchConfigI> = {
        ...(gameMode && { gameMode: gameMode as GameMode }),
        ...(params.has("language") && { language: params.get("language")! }),
        ...(params.has("difficultyLevel") && {
          difficultyLevel: params.get("difficultyLevel")! as DifficultyLevel,
        }),
        ...(params.has("timeLimit") && { timeLimit: params.get("timeLimit")! }),
        ...(params.has("topics") && {
          topics: params.get("topics")!.split(","),
        }),
      };
      saveConfig(config);
    }

    const checkAuth = async () => {
      try {
        const user = await getUser();
        setCurrentUser(user);

        if (!user?.isVerified) {
          setAuthStatus("unverified");
          return;
        }

        setAuthStatus("authenticated");
        // If gameMode exists, redirect directly to game page
        if (gameMode) {
          navigate({ to: `/game/${gameMode}` });
          return;
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
  }, [search, navigate, setCurrentUser, saveConfig]);

  if (authStatus === "unauthenticated") {
    const params = new URLSearchParams(search);
    const gameMode = params.get("gameMode");

    // SIMPLE REDIRECT LOGIC - JUST GAME MODE PATH
    const redirectPath = gameMode ? `/game/${gameMode}` : "/";
    return <Navigate to={`/auth/login?redirect=${redirectPath}`} />;
  }

  if (authStatus === "unverified") {
    return <Navigate to="/auth/verify-email" />;
  }

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
