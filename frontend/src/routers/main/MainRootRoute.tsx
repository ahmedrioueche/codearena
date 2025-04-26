import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../rootRoute";
import MainPage from "../../app/pages/main/MainPage";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export const MainRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  ),
});
