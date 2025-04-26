import React, { useState } from "react";
import { Users, Search, Play } from "lucide-react";

interface Player {
  id: string;
  name: string;
  avatar: string;
  status: "ready" | "not-ready";
}

interface Team {
  id: string;
  name: string;
  players: Player[];
}

const PlayerCard = ({ player }: { player: Player }) => (
  <div className="flex items-center p-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 flex items-center justify-center">
      <img
        src="/icons/developer.png"
        className="w-8 h-8 text-light-primary dark:text-dark-primary"
      />
    </div>
    <div className="ml-3 flex-1">
      <h3 className="font-medium text-light-foreground dark:text-dark-foreground">
        {player.name}
      </h3>
      <span
        className={`text-sm ${
          player.status === "ready" ? "text-green-500" : "text-yellow-500"
        }`}
      >
        {player.status === "ready" ? "Ready" : "Not Ready"}
      </span>
    </div>
  </div>
);

const TeamContainer = ({ team }: { team: Team }) => (
  <div className="bg-light-background/50 dark:bg-dark-background/50 rounded-xl p-4 space-y-4">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
        {team.name}
      </h2>
      <span className="text-sm text-light-foreground/60 dark:text-dark-foreground/60">
        {team.players.length} players
      </span>
    </div>
    <div className="space-y-3">
      {team.players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  </div>
);

const RoomMain = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Team Alpha",
      players: [
        { id: "1", name: "Player 1", avatar: "", status: "ready" },
        { id: "2", name: "Player 2", avatar: "", status: "not-ready" },
      ],
    },
    {
      id: "2",
      name: "Team Beta",
      players: [
        { id: "3", name: "Player 3", avatar: "", status: "ready" },
        { id: "4", name: "Player 4", avatar: "", status: "ready" },
      ],
    },
  ]);

  return (
    <div className="flex flex-col h-full w-full bg-light-background/80 dark:bg-dark-background/80">
      {/* Main Content */}
      <div className="flex-1 p-2 md:p-6 space-y-6 overflow-y-auto">
        {/* Search Status */}
        {isSearching && (
          <div className="bg-light-primary/5 dark:bg-dark-primary/5 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-spin">
                <Search className="w-5 h-5 text-light-primary dark:text-dark-primary" />
              </div>
              <span className="text-light-foreground dark:text-dark-foreground">
                Searching for players...
              </span>
            </div>
            <button
              onClick={() => setIsSearching(false)}
              className="text-sm text-light-primary dark:text-dark-primary hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teams.map((team) => (
            <TeamContainer key={team.id} team={team} />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-light-background dark:bg-dark-background">
        <div className="flex justify-between items-center px-2 md:px-6">
          <button
            onClick={() => setIsSearching(true)}
            disabled={isSearching}
            className={`px-6 py-2 rounded-lg flex items-center space-x-2 
              ${
                isSearching
                  ? "bg-light-secondary-disabled dark:bg-dark-secondary-disabled text-light-foreground/50 dark:text-dark-foreground/50"
                  : "bg-light-accent dark:bg-dark-accent text-white hover:opacity-90"
              } transition-colors`}
          >
            <Search className="w-5 h-5" />
            <span>Search for Players</span>
          </button>

          <button className="px-6 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <Play className="w-5 h-5" />
            <span>Start Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomMain;
