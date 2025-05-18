import axios from "axios";
import { User } from "../../types/user";
import { Room, RoomSettings } from "../../types/game/room";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const roomAxios = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RoomResponse {
  room: Room;
  user: User;
}

export const RoomApi = {
  createRoom: async (): Promise<RoomResponse> => {
    try {
      const response = await roomAxios.post("/room/create");
      console.log("response in createRoom", response);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  joinRoom: async (code: string): Promise<RoomResponse> => {
    try {
      const lowerCode = code.toLowerCase();
      const response = await roomAxios.post("/room/join", {
        code: lowerCode,
      });
      console.log("response in joinRoom", response);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getRoom: async (code: string): Promise<Room> => {
    try {
      const response = await roomAxios.get(`/room/${code}`);
      console.log("response in getRoom", response);
      return response.data.room;
    } catch (error: any) {
      throw error;
    }
  },

  removeUser: async (username: string, code: string): Promise<void> => {
    try {
      await roomAxios.delete("/room/remove-user", { data: { username, code } });
    } catch (error: any) {
      throw error;
    }
  },

  closeRoom: async (code: string): Promise<void> => {
    try {
      await roomAxios.delete("/room/close", { data: { code } });
    } catch (error: any) {
      throw error;
    }
  },

  updateSettings: async (
    code: string,
    settings: Partial<RoomSettings>
  ): Promise<Room> => {
    try {
      const response = await roomAxios.patch(`/room/${code}/settings`, {
        settings,
      });
      return response.data.room;
    } catch (error: any) {
      throw error;
    }
  },

  leaveRoom: async (code: string, userId: string): Promise<void> => {
    console.log("code, userId", code, userId);
    try {
      await roomAxios.post("/room/leave", { code, userId });
    } catch (error: any) {
      throw error;
    }
  },
};
