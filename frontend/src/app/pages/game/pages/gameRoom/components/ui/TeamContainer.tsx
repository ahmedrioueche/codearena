import { Plus } from "lucide-react";
import { Team } from "../../../../../../../types/game/game";
import PlayerCard from "./PlayerCard";

const TeamContainer = ({
  team,
  onAddPlayer,
  onPlayerTeamChange,
}: {
  team: Team;
  onAddPlayer?: () => void;
  onPlayerTeamChange?: (playerId: string) => void;
}) => (
  <div className="rounded-xl p-4 space-y-4 bg-light-background/50 dark:bg-dark-background/50 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${team.color} mr-3`}></div>
        <h2 className="text-lg font-semibold text-light-foreground dark:text-dark-foreground">
          {team.name}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-light-foreground/60 dark:text-dark-foreground/60">
          {team.players.length}{" "}
          {team.players.length === 1 ? "player" : "players"}
        </span>
        {onAddPlayer && (
          <button
            onClick={onAddPlayer}
            className="text-light-primary dark:text-dark-primary hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 p-1 rounded-full transition-colors"
            title="Add player"
            aria-label="Add player to team"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>

    <div className="space-y-3">
      {team.players.length > 0 ? (
        team.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onTeamChange={
              onPlayerTeamChange
                ? () => onPlayerTeamChange(player.id)
                : undefined
            }
          />
        ))
      ) : (
        <div className="text-center py-4 text-light-foreground/50 dark:text-dark-foreground/50">
          No players in this team
        </div>
      )}
    </div>
  </div>
);

export default TeamContainer;
