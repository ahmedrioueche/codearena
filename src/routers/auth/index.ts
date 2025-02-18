import { AuthRootRoute } from "./AuthRootRoute";
import { LoginRoute, SignUpRoute } from "./AuthRoutes";

export const AuthRouteTree = AuthRootRoute.addChildren([
  LoginRoute,
  SignUpRoute,
]);
