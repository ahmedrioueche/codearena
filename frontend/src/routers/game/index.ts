import { GameRootRoute } from "./GameRootRoute";
import {
  SoloRoute,
  BattleRoute,
  CollabRoute,
  RoomRoute,
  SaveTheCodebRoute,
} from "./GameRoute";

export const GameRootTree = GameRootRoute.addChildren([
  RoomRoute,
  SoloRoute,
  BattleRoute,
  CollabRoute,
  SaveTheCodebRoute,
]);
