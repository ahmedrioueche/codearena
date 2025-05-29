import React from "react";
import PlayerCard from "../../../components/ui/PlayerCard";
import { User } from "../../../../../../types/user";

interface PlayersContainerProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectOpponent: (player: User) => void;
}

const placeholderPlayers: User[] = [
  {
    _id: "1", username: "Alice", rank: "good", accuracy: 0.95, wins: 100, score: 1000,
    fullName: "",
    email: "",
    password: "",
    createdAt: ""
  },
  {
    _id: "2", username: "Bob", rank: "good", accuracy: 0.95, wins: 100, score: 1000,
    fullName: "",
    email: "",
    password: "",
    createdAt: ""
  },
  {
    _id: "3", username: "Charlie", rank: "good", accuracy: 0.95, wins: 100, score: 1000,
    fullName: "",
    email: "",
    password: "",
    createdAt: ""
  },
  {
    _id: "4", username: "David", rank: "good", accuracy: 0.95, wins: 100, score: 1000,
    fullName: "",
    email: "",
    password: "",
    createdAt: ""
  },
];

const PlayersContainer: React.FC<PlayersContainerProps> = ({
  isCollapsed,
  onToggleCollapse,
  onSelectOpponent,
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="h-full w-[90%] flex flex-col bg-light-background dark:bg-dark-background border-l border-light-border dark:border-dark-border">
      {/* Players List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {placeholderPlayers.map((player) => (
          <PlayerCard
            key={player._id}
            name={player.username}
            avatar="/icons/developer.png"
            score={player.score}
            rank={player.rank}
            onClick={() => {
              onSelectOpponent(player);
              onToggleCollapse();
            } } accuracy={player.accuracy} wins={player.wins}          />
        ))}
      </div>
    </div>
  );
};

export default PlayersContainer;
