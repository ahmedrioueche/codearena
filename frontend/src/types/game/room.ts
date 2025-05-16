import { User } from "../user";
import { GameMode } from "./game";

export interface RoomSettings {
  gameMode: GameMode;
  roomName: string;
  maxPlayers: number;
  teamSize: number;
  roomCode: string;
}

export interface Room {
  _id: string;
  code: string;
  users: User[];
  settings: RoomSettings;
  createdAt: string;
  updatedAt: string;
}
