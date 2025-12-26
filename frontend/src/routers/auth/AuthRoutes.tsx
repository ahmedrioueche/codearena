import { createRoute } from "@tanstack/react-router";
import LoginPage from "../../app/pages/auth/pages/login/pages/LoginPage";
import SignupPage from "../../app/pages/auth/pages/signup/page/SignupPage";
import { AuthRootRoute } from "./AuthRootRoute";

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
