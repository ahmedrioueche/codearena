import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../rootRoute";
import GamePage from "../../app/pages/game/pages/GamePage";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export const GameRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/game",
  component: () => (
    <ProtectedRoute>
      <GamePage />
    </ProtectedRoute>
  ),
});
