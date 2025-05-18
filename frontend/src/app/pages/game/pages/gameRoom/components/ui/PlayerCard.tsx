import { MoveRight } from "lucide-react";
import { User } from "../../../../../../../types/user";

const PlayerCard = ({
  player,
  isCurrentUser,
  onTeamChange,
}: {
  player: User;
  isCurrentUser: boolean;
  onTeamChange?: () => void;
}) => (
  <div
    className={`flex items-center p-4 rounded-2xl transition-all ${
      isCurrentUser
        ? "bg-gradient-to-r from-light-primary/10 to-light-secondary/15 dark:from-dark-primary/20 dark:to-dark-secondary/30 shadow-md"
        : "bg-light-background dark:bg-dark-background hover:shadow-sm"
    }`}
  >
    <div className="relative">
      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-light-accent/30 dark:ring-dark-accent/50 ring-offset-light-background dark:ring-offset-dark-background">
        <img
          src={"/icons/developer.png"}
          className="w-full h-full object-cover"
          alt={player.username}
        />
      </div>
      <div
        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-light-background dark:border-dark-background ${
          player.playStatus === "ready"
            ? "bg-green-500 animate-pulse"
            : "bg-yellow-500"
        }`}
      ></div>
    </div>

    <div className="ml-4 flex-1">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-light-foreground dark:text-dark-foreground">
          {player.username}
          {isCurrentUser && (
            <span className="ml-1 text-xs font-normal text-light-primary dark:text-dark-accent italic">
              (You)
            </span>
          )}
        </h3>

        {onTeamChange && (
          <button
            onClick={onTeamChange}
            className="text-xs text-light-primary dark:text-dark-accent hover:underline flex items-center px-2 py-1 rounded-full transition-all hover:bg-light-primary/10 dark:hover:bg-dark-accent/20"
          >
            Switch <MoveRight className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>

      <div className="flex items-center mt-1">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            player.playStatus === "ready"
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
          }`}
        >
          {player.playStatus === "ready" ? "Ready" : "Preparing"}
        </span>
      </div>
    </div>
  </div>
);

export default PlayerCard;
