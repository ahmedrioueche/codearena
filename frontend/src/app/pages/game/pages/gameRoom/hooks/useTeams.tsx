import { useEffect, useState } from "react";
import { Team } from "../../../../../../types/game/game";
import { Room } from "../../../../../../types/game/room";

const TEAM_COLORS = [
  "bg-light-primary dark:bg-dark-primary",
  "bg-light-accent dark:bg-dark-accent",
  "bg-pink-500 dark:bg-pink-500",
  "bg-green-500 dark:bg-green-600",
  "bg-yellow-500 dark:bg-yellow-600",
];

const MAX_TEAMS = 5;

export const useTeams = (room: Room, gameMode: GameMode) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!room?.users?.length) return;

    // For collaborative mode, create one team with all players
    if (gameMode === "collab") {
      const singleTeam: Team = {
        id: "collab-team",
        name: "Collaboration Team",
        color: TEAM_COLORS[0],
        players: [...room.users],
      };
      setTeams([singleTeam]);
      return;
    }

    // For other modes, create teams based on player count
    const playerCount = room.users.length;
    let teamCount = gameMode === "battle" ? 2 : 1; // Default teams based on mode

    // Special handling for battle mode
    if (gameMode === "battle") {
      if (playerCount <= 3) {
        teamCount = playerCount;
      } else if (playerCount % 2 === 0) {
        teamCount = 2;
      } else if (playerCount % 3 === 0) {
        teamCount = 3;
      } else {
        teamCount = Math.min(Math.floor(playerCount / 2), MAX_TEAMS);
      }
    }

    // Create regular teams
    const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: `team-${i + 1}`,
      name: `Team ${String.fromCharCode(65 + i)}`,
      color: TEAM_COLORS[i % TEAM_COLORS.length],
      players: [],
    }));

    // Create test team (except for save-the-code mode)
    const testTeam: Team = {
      id: "test-team",
      name: "Test Team",
      color: "bg-purple-500 dark:bg-purple-600",
      players: [],
    };

    // Distribute players
    room.users.forEach((user, index) => {
      const teamIndex = index % teamCount;
      newTeams[teamIndex].players.push(user);
    });

    // Combine teams
    setTeams(testTeam ? [...newTeams, testTeam] : newTeams);
  }, [room, gameMode]);

  return { teams, setTeams };
};

export type GameMode = "solo" | "battle" | "collab" | "save-the-code";
