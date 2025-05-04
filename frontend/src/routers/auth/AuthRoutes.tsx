import { createRoute } from "@tanstack/react-router";
import { AuthRootRoute } from "./AuthRootRoute";
import LoginPage from "../../app/pages/auth/pages/login/pages/LoginPage";
import SignupPage from "../../app/pages/auth/pages/signup/page/SignupPage";
import VerifyEmailPage from "../../app/pages/auth/pages/verify-email/VerifyEmailPage";

export const LoginRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

export const SignUpRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/signup",
  component: () => <SignupPage />,
});

export const VerifyEmailRoute = createRoute({
  getParentRoute: () => AuthRootRoute,
  path: "/verify-email",
  component: () => <VerifyEmailPage />,
});
