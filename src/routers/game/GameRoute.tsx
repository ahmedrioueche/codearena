import { createRoute } from "@tanstack/react-router";
import { GameRootRoute } from "./GameRootRoute";
import BattlePage from "../../app/pages/game/pages/battle/pages/BattlePage";
import CollabPage from "../../app/pages/game/pages/collab/pages/CollabPage";
import SoloPage from "../../app/pages/game/pages/solo/pages/SoloPage";
import RoomPage from "../../app/pages/game/pages/gameRoom/pages/RoomPage";

export const RoomRoute = createRoute({
  getParentRoute: () => GameRootRoute,
  path: "/room",
  component: () => <RoomPage />,
});

export const SoloRoute = createRoute({
  getParentRoute: () => GameRootRoute,
  path: "/solo",
  component: () => <SoloPage />,
});

export const BattleRoute = createRoute({
  getParentRoute: () => GameRootRoute,
  path: "/battle",
  component: () => <BattlePage />,
});

export const CollabRoute = createRoute({
  getParentRoute: () => GameRootRoute,
  path: "/collab",
  component: () => <CollabPage />,
});
