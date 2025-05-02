import React from "react";
import PlayerCard from "../../../components/ui/PlayerCard";
import { Player } from "../../../../../../types/game/game";

interface PlayersContainerProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectOpponent: (player: Player) => void;
}

const placeholderPlayers: Player[] = [
  { id: 1, name: "Alice", rating: 1200, skillLevel: "junior" },
  { id: 2, name: "Bob", rating: 1350, skillLevel: "intermediate" },
  { id: 3, name: "Charlie", rating: 1500, skillLevel: "senior" },
  { id: 4, name: "David", rating: 1100, skillLevel: "beginner" },
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
            key={player.id}
            name={player.name}
            avatar="/icons/developer.png"
            rating={player.rating}
            skillLevel={player.skillLevel}
            onClick={() => {
              onSelectOpponent(player);
              onToggleCollapse();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayersContainer;
