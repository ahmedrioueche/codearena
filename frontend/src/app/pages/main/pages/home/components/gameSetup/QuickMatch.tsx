import PlayersConfig from "./PlayersConfig";
import GameSearch from "./GameSearch";
import { GameSettings } from "../../../../../../../types/game/game";
import MatchConfig from "./MatchConfig";

function QuickMatch({
  gameSettings,
  isSearchStarted,
  onChange,
}: {
  gameSettings: GameSettings;
  isSearchStarted: boolean;
  onChange: (settings: GameSettings) => void;
}) {
  return (
    <div>
      {!isSearchStarted ? (
        <div>
          <div className="mt-4">
            <PlayersConfig
              gameMode={gameSettings.gameMode!}
              configMode="create"
            />
          </div>
          <div className="mt-8">
            <MatchConfig
              gameMode={gameSettings.gameMode!}
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div>
          <GameSearch
            gameMode={gameSettings.gameMode!}
            gameSettings={gameSettings}
            isSearchStarted={isSearchStarted}
          />
        </div>
      )}
    </div>
  );
}

export default QuickMatch;
