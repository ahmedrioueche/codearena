import { Navigate, useLocation } from "@tanstack/react-router";
import { FC, ReactNode, useEffect, useState } from "react";
import { getUser } from "../api/user";
import { useAppContext } from "../context/AppContext";
import LoadingScreen from "./LoadingPage";
import { refreshToken } from "../api/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { setCurrentUser } = useAppContext();
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated" | "unverified"
  >("loading");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First attempt to get user
        const user = await getUser();
        setCurrentUser(user);
        if (!user?.isVerified) {
          setAuthStatus("unverified");
          return;
        }
        setAuthStatus("authenticated");
      } catch (error: any) {
        // Check if error is 401 Unauthorized
        if (error.response?.status === 401) {
          try {
            // Attempt to refresh token
            await refreshToken();

            // Retry getting user with new token
            const user = await getUser();
            setCurrentUser(user);
            setAuthStatus("authenticated");
          } catch (refreshError) {
            // Refresh failed - user is truly unauthenticated
            setAuthStatus("unauthenticated");
          }
        } else {
          // For non-401 errors, consider unauthenticated
          setAuthStatus("unauthenticated");
        }
      }
    };
    checkAuth();
  }, [setCurrentUser]);

  if (authStatus === "loading") {
    return <LoadingScreen />;
  }

  if (authStatus === "unauthenticated") {
    const redirectUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
    return <Navigate to={redirectUrl} />;
  }

  if (authStatus === "unverified") {
    const redirectUrl = `/auth/verify-email`;
    return <Navigate to={redirectUrl} />;
  }

  return <>{children}</>;
};
