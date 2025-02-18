import { GameRootRoute } from "./GameRootRoute";
import { SoloRoute, BattleRoute, CollabRoute, RoomRoute } from "./GameRoute";

export const GameRootTree = GameRootRoute.addChildren([
  RoomRoute,
  SoloRoute,
  BattleRoute,
  CollabRoute,
]);
