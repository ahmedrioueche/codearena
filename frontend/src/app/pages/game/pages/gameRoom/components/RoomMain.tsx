import { useState } from "react";
import { Play, Users, Plus, Shuffle } from "lucide-react";
import { Team } from "../../../../../../types/game/game";
import TeamContainer from "./ui/TeamContainer";

// Color palette using only colors from your Tailwind config
const TEAM_COLORS = [
  "bg-light-primary dark:bg-dark-primary", // Primary color
  "bg-light-accent dark:bg-dark-accent", // Accent color
  "bg-light-secondary dark:bg-dark-secondary", // Secondary color
  "bg-green-500", // From your green status color
  "bg-yellow-500", // From your yellow status color
];

const RoomMain = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Team Alpha",
      color: TEAM_COLORS[0],
      players: [
        {
          id: "1",
          name: "Player 1",
          avatar: "",
          status: "ready",
          isCurrentUser: true,
          rating: 0,
          skillLevel: "beginner",
        },
        {
          id: "2",
          name: "Player 2",
          avatar: "",
          status: "not-ready",
          isCurrentUser: false,
          rating: 0,
          skillLevel: "beginner",
        },
      ],
    },
    {
      id: "2",
      name: "Team Beta",
      color: TEAM_COLORS[1],
      players: [
        {
          id: "3",
          name: "Player 3",
          avatar: "",
          status: "ready",
          isCurrentUser: false,
          rating: 0,
          skillLevel: "beginner",
        },
      ],
    },
    {
      id: "3",
      name: "Team Gamma",
      color: TEAM_COLORS[2],
      players: [],
    },
  ]);

  const currentUser = teams
    .flatMap((team) => team.players)
    .find((player) => player.isCurrentUser);

  const handleTeamChange = (playerId: string) => {
    setTeams((prevTeams) => {
      const playerTeamIndex = prevTeams.findIndex((team) =>
        team.players.some((p) => p.id === playerId)
      );

      if (playerTeamIndex === -1) return prevTeams;

      const player = prevTeams[playerTeamIndex].players.find(
        (p) => p.id === playerId
      );
      if (!player) return prevTeams;

      const updatedTeams = [...prevTeams];
      updatedTeams[playerTeamIndex] = {
        ...updatedTeams[playerTeamIndex],
        players: updatedTeams[playerTeamIndex].players.filter(
          (p) => p.id !== playerId
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

  const handleAddTeam = () => {
    if (teams.length >= TEAM_COLORS.length) return;

    setTeams((prevTeams) => [
      ...prevTeams,
      {
        id: `team-${Date.now()}`,
        name: `Team ${String.fromCharCode(65 + teams.length)}`,
        color: TEAM_COLORS[teams.length],
        players: [],
      },
    ]);
  };

  const handleShuffleTeams = () => {
    setTeams((prevTeams) => {
      const allPlayers = prevTeams.flatMap((team) => team.players);
      const shuffledPlayers = [...allPlayers].sort(() => Math.random() - 0.5);

      return prevTeams.map((team, index) => {
        const playersPerTeam = Math.ceil(
          shuffledPlayers.length / prevTeams.length
        );
        const start = index * playersPerTeam;
        const end = start + playersPerTeam;
        return {
          ...team,
          players: shuffledPlayers.slice(start, end),
        };
      });
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-light-background/80 dark:bg-dark-background/80">
      <div className="flex-1 p-2 md:p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamContainer
              key={team.id}
              team={team}
              onPlayerTeamChange={handleTeamChange}
            />
          ))}

          {teams.length < TEAM_COLORS.length && (
            <button
              onClick={handleAddTeam}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl hover:bg-light-background/50 dark:hover:bg-dark-background/50 transition-colors"
            >
              <Plus className="w-8 h-8 text-light-foreground/50 dark:text-dark-foreground/50 mb-2" />
              <span className="text-light-foreground/50 dark:text-dark-foreground/50">
                Add Team
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 bg-light-background dark:bg-dark-background border-t border-light-border dark:border-dark-border">
        <div className="flex justify-between items-center px-2 md:px-6">
          <div className="flex space-x-3">
            <button
              onClick={handleShuffleTeams}
              className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-light-secondary dark:bg-dark-secondary text-light-foreground dark:text-dark-foreground hover:bg-light-secondary/80 dark:hover:bg-dark-secondary/80 transition-colors"
            >
              <Shuffle className="w-5 h-5" />
              <span>Shuffle Teams</span>
            </button>

            <button className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-light-secondary dark:bg-dark-secondary text-light-foreground dark:text-dark-foreground hover:bg-light-secondary/80 dark:hover:bg-dark-secondary/80 transition-colors">
              <Users className="w-5 h-5" />
              <span>Invite Players</span>
            </button>
          </div>

          <button
            disabled={!currentUser || currentUser.status !== "ready"}
            className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-opacity ${
              currentUser?.status === "ready"
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
