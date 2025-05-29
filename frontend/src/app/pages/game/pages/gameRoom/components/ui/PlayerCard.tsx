import { GripVertical } from "lucide-react";
import { User } from "../../../../../../../types/user";
import Button from "../../../../../../../components/ui/Button";
import { useAppContext } from "../../../../../../../context/AppContext";
import { RoomApi } from "../../../../../../../api/game/room";

const PlayerCard = ({
  player,
  isCurrentUser,
  isAdmin,
  isDragging,
  canDrag,
}: {
  player: User;
  isCurrentUser: boolean;
  isAdmin: boolean;
  isDragging?: boolean;
  canDrag?: boolean;
}) => {
  const { currentUser } = useAppContext();

  const handleSetReady = async () => {
    await RoomApi.setPlayerReady();
  };

  return (
    <div
      className={`flex items-center p-4 rounded-2xl transition-all ${
        isCurrentUser
          ? "bg-gradient-to-r from-light-primary/10 to-light-secondary/15 dark:from-dark-primary/20 dark:to-dark-secondary/30 shadow-md"
          : "bg-light-background dark:bg-dark-background hover:shadow-sm"
      } ${isDragging ? "shadow-lg opacity-80" : ""} ${
        isAdmin ? "border-l-4 border-yellow-500" : ""
      }`}
    >
      <div className="flex items-center w-full">
        {canDrag && (
          <GripVertical className="w-5 h-5 mr-3 text-light-foreground/40 dark:text-dark-foreground/40 cursor-grab" />
        )}

        <div className="relative flex-shrink-0">
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
              {isAdmin && (
                <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
            </h3>

            {/* Add Set Ready button conditionally */}
            {player._id === currentUser._id &&
              player.playStatus !== "ready" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSetReady}
                  className="ml-2 text-xs"
                >
                  Ready?
                </Button>
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
    </div>
  );
};

export default PlayerCard;
