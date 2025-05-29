import { Plus } from "lucide-react";
import { Team } from "../../../../../../../types/game/game";
import PlayerCard from "./PlayerCard";
import { useAppContext } from "../../../../../../../context/AppContext";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Room } from "../../../../../../../types/game/room";

const TeamContainer = ({
  team,
  room,
  onAddPlayer,
}: {
  team: Team;
  room: Room;
  onAddPlayer?: () => void;
}) => {
  const { currentUser } = useAppContext();

  // Check if current user is the room admin
  const isAdmin = currentUser?._id === room?.adminId;

  return (
    <Droppable droppableId={team.id} key={team.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`rounded-2xl p-5 bg-light-primary/10 dark:bg-dark-primary/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-all ${
            snapshot.isDraggingOver
              ? "ring-2 ring-light-accent dark:ring-dark-accent"
              : ""
          }`}
        >
          {/* Header - completely unchanged from original */}
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
              {onAddPlayer && isAdmin && (
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

          {/* Player list with drop feedback */}
          <div className="space-y-3">
            {team.players.length > 0 ? (
              team.players.map((player, playerIndex) => (
                <Draggable
                  key={player._id}
                  draggableId={player._id}
                  index={playerIndex}
                  isDragDisabled={!isAdmin}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "opacity-50" : ""}
                    >
                      <PlayerCard
                        player={player}
                        isCurrentUser={currentUser._id === player._id}
                        isDragging={snapshot.isDragging}
                        isAdmin={player._id === room?.adminId}
                        canDrag={isAdmin}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div className="text-center py-6 text-light-foreground/50 dark:text-dark-foreground/50 italic">
                {snapshot.isDraggingOver
                  ? "Drop players here"
                  : "No players in this team"}
              </div>
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TeamContainer;
