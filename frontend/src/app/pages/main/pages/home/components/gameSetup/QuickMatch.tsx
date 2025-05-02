import PlayersConfig from "./PlayersConfig";
import GameSearch from "./GameSearch";
import { GameMode, GameSettings } from "../../../../../../../types/game/game";
import MatchConfig from "./MatchConfig";

function QuickMatch({
  gameMode,
  isSearchStarted,
}: {
  gameMode: GameMode;
  isSearchStarted: boolean;
}) {
  const gameSettings: GameSettings = {
    language: "javascript",
    difficultyLevel: "medium",
    timeLimit: "30",
    topics: ["data_structure", "algorithms"],
    maxPlayers: "",
    teamSize: "",
  };

  return (
    <div>
      {!isSearchStarted ? (
        <div>
          <div className="mt-4">
            <PlayersConfig gameMode={gameMode} configMode="create" />
          </div>
          <div className="mt-8">
            <MatchConfig gameMode={gameMode} />
          </div>
        </div>
      ) : (
        <div>
          <GameSearch gameMode={gameMode} gameSettings={gameSettings} />
        </div>
      )}
    </div>
  );
}

export default QuickMatch;
