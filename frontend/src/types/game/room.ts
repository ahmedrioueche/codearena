import { User } from "../user";
import { GameSettings } from "./game";

export interface Room {
  _id: string;
  code: string;
  users: User[];
  settings: GameSettings;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}
