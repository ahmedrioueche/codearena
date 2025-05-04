import { AuthRootRoute } from "./AuthRootRoute";
import { LoginRoute, SignUpRoute, VerifyEmailRoute } from "./AuthRoutes";

export const AuthRouteTree = AuthRootRoute.addChildren([
  LoginRoute,
  SignUpRoute,
  VerifyEmailRoute,
]);
