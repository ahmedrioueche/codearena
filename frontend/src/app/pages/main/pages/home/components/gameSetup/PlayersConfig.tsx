import { useState } from "react";
import { ConfigMode, GameMode } from "../../../../../../../types/game/game";

interface TeamSettings {
  maxPlayers: string;
  teamSize: string;
  inviteCode: string;
}
function PlayersConfig({
  gameMode,
}: {
  gameMode: GameMode;
  configMode: ConfigMode;
}) {
  const [teamSettings, setTeamSettings] = useState<TeamSettings>({
    maxPlayers: "4",
    teamSize: "1",
    inviteCode: "BATTLE-123456",
  });

  const maxPlayersOptions = ["2", "3", "4", "5", "6"];

  const getValidTeamSizeOptions = (maxPlayers: string) => {
    const max = parseInt(maxPlayers);
    if (max % 2 !== 0) {
      return ["1"];
    }
    return Array.from({ length: max - 1 }, (_, i) => i + 1)
      .filter((num) => max % num === 0 && num < max)
      .map(String);
  };

  const handleMaxPlayersChange = (num: string) => {
    setTeamSettings({
      maxPlayers: num,
      teamSize:
        parseInt(teamSettings.teamSize) <= parseInt(num)
          ? teamSettings.teamSize
          : "1", // Reset team size if invalid
      inviteCode: teamSettings.inviteCode,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-light-foreground dark:text-dark-foreground">
        Team Configuration
      </h3>
      <div
        className={`grid  ${
          gameMode !== "battle" ? "grid-cols-1" : "grid-cols-2"
        } gap-4`}
      >
        <div className="p-4 rounded-xl border-2 border-light-border dark:border-dark-border">
          <label className="block text-sm font-medium mb-2 text-light-foreground dark:text-dark-foreground">
            Max Players
          </label>
          <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
            {maxPlayersOptions.map((num) => (
              <button
                key={num}
                onClick={() => handleMaxPlayersChange(num)}
                className={`p-3 rounded-lg border-2 transition-colors text-center text-black dark:text-white font-medium ${
                  teamSettings.maxPlayers === num
                    ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                    : "border-light-border dark:border-dark-border"
                }`}
              >
                {num} players
              </button>
            ))}
          </div>
        </div>
        {/* we only have teams in battle mode */}
        {gameMode === "battle" && (
          <div className="p-4 rounded-xl border-2 border-light-border dark:border-dark-border">
            <label className="block text-sm font-medium mb-2 text-light-foreground dark:text-dark-foreground">
              Team Size
            </label>
            <div className="grid grid-cols-2 gap-2">
              {getValidTeamSizeOptions(teamSettings.maxPlayers).map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setTeamSettings({ ...teamSettings, teamSize: num })
                  }
                  className={`p-3 rounded-lg border-2 transition-colors text-center font-medium  text-black dark:text-white ${
                    teamSettings.teamSize === num
                      ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                      : "border-light-border dark:border-dark-border"
                  }`}
                >
                  {num} per team
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayersConfig;
