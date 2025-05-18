import { useState } from "react";
import { Play, Copy } from "lucide-react";
import { Team } from "../../../../../../types/game/game";
import TeamContainer from "./ui/TeamContainer";
import { Room } from "../../../../../../types/game/room";
import { useAppContext } from "../../../../../../context/AppContext";
import { User } from "../../../../../../types/user";

const TEAM_COLORS = [
  "bg-light-primary dark:bg-dark-primary",
  "bg-light-accent dark:bg-dark-accent",
  "bg-pink-500 dark:bg-pink-500",
  "bg-green-500",
  "bg-yellow-500",
];

const RoomMain = ({ room, users }: { room: Room; users: User[] }) => {
  const [copied, setCopied] = useState(false);
  const { currentUser } = useAppContext();
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Team Alpha",
      color: TEAM_COLORS[0],
      players: users,
    },
  ]);

  const handleTeamChange = (playerId: string) => {
    setTeams((prevTeams) => {
      const playerTeamIndex = prevTeams.findIndex((team) =>
        team.players.some((p) => p._id === playerId)
      );

      if (playerTeamIndex === -1) return prevTeams;

      const player = prevTeams[playerTeamIndex].players.find(
        (p) => p._id === playerId
      );
      if (!player) return prevTeams;

      const updatedTeams = [...prevTeams];
      updatedTeams[playerTeamIndex] = {
        ...updatedTeams[playerTeamIndex],
        players: updatedTeams[playerTeamIndex].players.filter(
          (p) => p._id !== playerId
        ),
      };

      let targetTeamIndex = (playerTeamIndex + 1) % updatedTeams.length;
      updatedTeams[targetTeamIndex] = {
        ...updatedTeams[targetTeamIndex],
        players: [...updatedTeams[targetTeamIndex].players, player],
      };

      return updatedTeams;
    });
  };

  const handleCopy = () => {
    if (room.code) {
      navigator.clipboard.writeText(room.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-light-background/80 dark:bg-dark-background/80">
      <div className="flex-1 p-2 md:p-6 space-y-6 mt-4 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamContainer
              key={team.id}
              team={team}
              onPlayerTeamChange={handleTeamChange}
            />
          ))}
        </div>
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

          <button
            disabled={!currentUser || currentUser.playStatus !== "ready"}
            className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-opacity ${
              currentUser?.playStatus === "ready"
                ? "bg-light-primary dark:bg-dark-primary text-white hover:opacity-90"
                : "bg-light-secondary-disabled dark:bg-dark-secondary-disabled text-light-foreground/50 dark:text-dark-foreground/50"
            }`}
          >
            <Play className="w-5 h-5" />
            <span>Start Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomMain;
