import { MoveRight } from "lucide-react";
import { Player } from "../../../../../../../types/game/game";

const PlayerCard = ({
  player,
  onTeamChange,
}: {
  player: Player;
  onTeamChange?: () => void;
}) => (
  <div
    className={`flex items-center p-3 rounded-lg border transition-all ${
      player.isCurrentUser
        ? "border-2 border-light-primary dark:border-dark-primary shadow-md"
        : "border-light-border dark:border-dark-border"
    }`}
  >
    <div className="relative">
      <img
        src={player.avatar || "/icons/developer.png"}
        className="w-10 h-10 rounded-full object-cover"
        alt={player.name}
      />
      <div
        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-light-background dark:border-dark-background ${
          player.status === "ready" ? "bg-green-500" : "bg-yellow-500"
        }`}
      ></div>
    </div>
    <div className="ml-3 flex-1">
      <h3 className="font-medium text-light-foreground dark:text-dark-foreground">
        {player.name} {player.isCurrentUser && "(You)"}
      </h3>
      <div className="flex items-center space-x-2 mt-1">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            player.status === "ready"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {player.status === "ready" ? "Ready" : "Preparing"}
        </span>
        {onTeamChange && (
          <button
            onClick={onTeamChange}
            className="text-xs text-light-primary dark:text-dark-primary hover:underline flex items-center"
          >
            Switch <MoveRight className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default PlayerCard;
