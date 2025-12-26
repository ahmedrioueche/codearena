import { useLocation, useNavigate } from "@tanstack/react-router";
import { FC, ReactNode, useEffect, useState } from "react";
import { refreshToken } from "../api/auth";
import { getUser } from "../api/user";
import { useMatchConfig } from "../app/hooks/useMatchConfig";
import { useAppContext } from "../context/AppContext";
import { DifficultyLevel, GameMode } from "../types/game/game";
import LoadingScreen from "./LoadingPage";

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
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      return;
    }

    const params = new URLSearchParams(search);
    const gameMode = params.get("gameMode");

    // Save config to localStorage
    if (params.size > 0) {
      saveConfig({
        ...(gameMode && { gameMode: gameMode as GameMode }),
        ...(params.has("language") && { language: params.get("language")! }),
        ...(params.has("difficultyLevel") && {
          difficultyLevel: params.get("difficultyLevel")! as DifficultyLevel,
        }),
        ...(params.has("timeLimit") && {
          timeLimit: parseInt(params.get("timeLimit")!),
        }),
        ...(params.has("topics") && {
          topics: params.get("topics")!.split(","),
        }),
      });
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

        if (gameMode) {
          setRedirectPath(`/game/${gameMode}`);
          setShouldRedirect(true);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            await refreshToken();
            const user = await getUser();
            setCurrentUser(user);
            setAuthStatus("authenticated");

            if (gameMode) {
              setRedirectPath(`/game/${gameMode}`);
              setShouldRedirect(true);
            }
          } catch {
            setAuthStatus("unauthenticated");
            setRedirectPath(gameMode ? `/game/${gameMode}` : "/");
            setShouldRedirect(true);
          }
        } else {
          setAuthStatus("unauthenticated");
          setRedirectPath(gameMode ? `/game/${gameMode}` : "/");
          setShouldRedirect(true);
        }
      }
    };

    checkAuth();
  }, [search, setCurrentUser, saveConfig]);

  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      if (authStatus === "unauthenticated") {
        navigate({ to: `/auth/login?redirect=${redirectPath}` });
      } else if (authStatus === "authenticated") {
        navigate({ to: redirectPath });
      }
      setShouldRedirect(false);
    }
  }, [shouldRedirect, redirectPath, authStatus, navigate]);

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
