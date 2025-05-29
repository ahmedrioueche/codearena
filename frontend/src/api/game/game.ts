import axios from "axios";
import { GameSettings } from "../../types/game/game";
import { Room } from "../../types/game/room";
import { User } from "../../types/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const gameAxios = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface SearchResponse {
  room: Room;
  matchedUsers: User[];
  searchId: string;
}

interface MatchmakingEvents {
  onMatchFound: (data: SearchResponse) => void;
  onMatchProgress: (data: { message: string; matchedCount: number }) => void;
  onError: (error: string) => void;
}

class GameMatchmaking {
  private searchId: string | null = null;
  private channel: any | null = null;
  private events: MatchmakingEvents | null = null;

  async startSearch(settings: GameSettings, events: MatchmakingEvents): Promise<void> {
    try {
      // First create a search on the server
      const response = await gameAxios.post<{ searchId: string }>("/game/search-players", {
        settings,
      });

      this.searchId = response.data.searchId;
      this.events = events;

      // Subscribe to the search channel
      if (this.searchId && window.pusher) {
        this.channel = window.pusher.subscribe(`search-${this.searchId}`);

        this.channel.bind('match-progress', (data: { message: string; matchedCount: number }) => {
          this.events?.onMatchProgress(data);
        });

        this.channel.bind('match-found', (data: SearchResponse) => {
          this.events?.onMatchFound(data);
        });

        this.channel.bind('match-error', (error: string) => {
          this.events?.onError(error);
        });
      }
    } catch (error: any) {
      events.onError(error.message || "Failed to start search");
    }
  }

  async cancelSearch(): Promise<void> {
    try {
      if (this.searchId) {
        await gameAxios.post("/game/cancel-search", {
          searchId: this.searchId,
        });
        this.cleanup();
      }
    } catch (error: any) {
      console.error("Error canceling search:", error);
    }
  }

  cleanup() {
    if (this.searchId && this.channel) {
      this.channel.unbind_all();
      window.pusher?.unsubscribe(`search-${this.searchId}`);
    }
    this.searchId = null;
    this.channel = null;
    this.events = null;
  }
}

export const GameApi = {
  matchmaking: new GameMatchmaking(),

  searchPlayers: async (
    settings: GameSettings,
    events: MatchmakingEvents
  ): Promise<void> => {
    return GameApi.matchmaking.startSearch(settings, events);
  },

  cancelSearch: async (): Promise<void> => {
    return GameApi.matchmaking.cancelSearch();
  },
};
