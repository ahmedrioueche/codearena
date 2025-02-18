import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../rootRoute";
import GamePage from "../../app/pages/game/pages/GamePage";

export const GameRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/game",
  component: () => <GamePage />,
});
