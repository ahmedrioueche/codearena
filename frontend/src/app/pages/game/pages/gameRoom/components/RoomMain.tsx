import { useState } from "react";
import { Play, Copy } from "lucide-react";
import TeamContainer from "./ui/TeamContainer";
import { Room } from "../../../../../../types/game/room";
import { useAppContext } from "../../../../../../context/AppContext";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useTeams } from "../hooks/useTeams";
import PlayerCard from "./ui/PlayerCard";
import { router } from "../../../../../../routers";
import { APP_PAGES } from "../../../../../../constants/navigation";

const RoomMain = ({ room }: { room: Room }) => {
  const [copied, setCopied] = useState(false);
  const { currentUser } = useAppContext();
  const gameMode = room?.settings?.gameMode;
  const { teams, setTeams } = useTeams(room, gameMode!);

  const handleStartGame = () => {
    switch (room.settings.gameMode) {
      case "collab":
        router.navigate({ to: APP_PAGES.game.collab.route });
        return;
      case "battle":
        router.navigate({ to: APP_PAGES.game.battle.route });
        return;
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Same team, just reordering
    if (source.droppableId === destination.droppableId) {
      setTeams((prevTeams) => {
        const newTeams = [...prevTeams];
        const teamIndex = newTeams.findIndex(
          (t) => t.id === source.droppableId
        );

        // Make a copy of the players array to avoid mutating state directly
        const newPlayers = [...newTeams[teamIndex].players];
        const [removed] = newPlayers.splice(source.index, 1);
        newPlayers.splice(destination.index, 0, removed);

        // Return new state with updated players
        return newTeams.map((team) =>
          team.id === source.droppableId
            ? { ...team, players: newPlayers }
            : team
        );
      });
    }
    // Moving between teams
    else {
      setTeams((prevTeams) => {
        const newTeams = [...prevTeams];
        const sourceTeamIndex = newTeams.findIndex(
          (t) => t.id === source.droppableId
        );
        const destTeamIndex = newTeams.findIndex(
          (t) => t.id === destination.droppableId
        );

        if (sourceTeamIndex === -1 || destTeamIndex === -1) return prevTeams;

        // Create copies of the players arrays
        const sourcePlayers = [...newTeams[sourceTeamIndex].players];
        const destPlayers = [...newTeams[destTeamIndex].players];

        // Remove from source team
        const [movedPlayer] = sourcePlayers.splice(source.index, 1);

        // Add to destination team at correct position
        destPlayers.splice(destination.index, 0, movedPlayer);

        // Return new state with updated teams
        return newTeams.map((team, index) => {
          if (index === sourceTeamIndex)
            return { ...team, players: sourcePlayers };
          if (index === destTeamIndex) return { ...team, players: destPlayers };
          return team;
        });
      });
    }
  };

  const handleCopy = () => {
    if (room.code) {
      navigator.clipboard.writeText(room.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      });
    }
  };

  const isAdmin = currentUser._id === room.adminId;
  const allUsersReady =
    room?.users.every((user) => user.playStatus === "ready") ?? false;

  return (
    <div className="flex flex-col h-full w-full bg-light-background/80 dark:bg-dark-background/80">
      <div className="flex-1 p-2 md:p-6 space-y-6 mt-4 overflow-y-auto">
        {gameMode === "collab" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="col-span-full rounded-2xl p-5 bg-light-primary/10 dark:bg-dark-primary/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-light-primary dark:bg-dark-primary" />
                  <h2 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground">
                    All Players
                  </h2>
                </div>
                <span className="text-sm text-light-foreground/60 dark:text-dark-foreground/60">
                  {room.users.length}{" "}
                  {room.users.length === 1 ? "player" : "players"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.users.map((player) => (
                  <div key={player._id}>
                    <PlayerCard
                      player={player}
                      isCurrentUser={currentUser._id === player._id}
                      isDragging={false}
                      isAdmin={player._id === room?.adminId}
                      canDrag={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamContainer key={team.id} team={team} room={room} />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
      <div className="p-4 bg-light-background dark:bg-dark-background border-t border-light-border dark:border-dark-border">
        <div className="flex justify-between items-center px-2 md:px-6">
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-light-secondary dark:bg-dark-secondary text-light-foreground dark:text-dark-foreground hover:bg-light-secondary/80 dark:hover:bg-dark-secondary/80 transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span>{copied ? "Copied!" : room.code}</span>
            </button>
          </div>
          {isAdmin && (
            <button
              onClick={handleStartGame}
              disabled={!allUsersReady}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-opacity ${
                allUsersReady
                  ? "bg-light-primary dark:bg-dark-primary text-white hover:opacity-90"
                  : "bg-light-secondary-disabled dark:bg-dark-secondary-disabled text-light-foreground/50 dark:text-dark-foreground/50"
              }`}
            >
              <Play className="w-5 h-5" />
              <span>Start Game</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomMain;
