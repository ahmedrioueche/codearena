import { Plus } from "lucide-react";
import { Team } from "../../../../../../../types/game/game";
import PlayerCard from "./PlayerCard";
import { useAppContext } from "../../../../../../../context/AppContext";

const TeamContainer = ({
  team,
  onAddPlayer,
  onPlayerTeamChange,
}: {
  team: Team;
  onAddPlayer?: () => void;
  onPlayerTeamChange?: (playerId: string) => void;
}) => {
  const { currentUser } = useAppContext();

  return (
    <div className="rounded-2xl p-5 bg-light-primary/10 dark:bg-dark-primary/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${team.color}`} />
          <h2 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground">
            {team.name}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-light-foreground/60 dark:text-dark-foreground/60">
            {team.players.length}{" "}
            {team.players.length === 1 ? "player" : "players"}
          </span>
          {onAddPlayer && (
            <button
              onClick={onAddPlayer}
              className="p-2 rounded-full bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary hover:bg-light-primary/20 dark:hover:bg-dark-primary/20 transition-colors"
              title="Add player"
              aria-label="Add player"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Player list */}
      <div className="space-y-3">
        {team.players.length > 0 ? (
          team.players.map((player) => (
            <PlayerCard
              key={player._id}
              player={player}
              onTeamChange={
                onPlayerTeamChange
                  ? () => onPlayerTeamChange(player._id)
                  : undefined
              }
              isCurrentUser={currentUser._id === player._id}
            />
          ))
        ) : (
          <div className="text-center py-6 text-light-foreground/50 dark:text-dark-foreground/50 italic">
            No players in this team
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamContainer;
