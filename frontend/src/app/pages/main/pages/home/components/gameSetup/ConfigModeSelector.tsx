import { PlusCircle, Search, Users } from "lucide-react";
import { useState } from "react";
import {
  CONFIG_MODES,
  ConfigMode,
  GameMode,
} from "../../../../../../../types/game/game";

const ConfigModeSelector = ({
  onSelectConfigMode,
}: {
  gameMode: GameMode;
  onSelectConfigMode: (configMode: ConfigMode) => void;
}) => {
  const [configMode, setConfigMode] = useState<ConfigMode>(CONFIG_MODES.SEARCH);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[
        {
          mode: CONFIG_MODES.SEARCH,
          icon: (
            <Search className="w-6 h-6 text-light-primary dark:text-dark-primary" />
          ),
          title: "Quick Match",
          description: "Find opponents based on your preferences",
        },

        {
          mode: CONFIG_MODES.CREATE,
          icon: (
            <PlusCircle className="w-6 h-6 text-light-primary dark:text-dark-primary" />
          ),
          title: "Create Room",
          description: "Create a private room and invite friends",
        },
        {
          mode: CONFIG_MODES.JOIN,
          icon: (
            <Users className="w-6 h-6 text-light-primary dark:text-dark-primary" />
          ),
          title: "Join Room",
          description: "Join an existing room with a code",
        },
      ].map((option) => (
        <button
          key={option.mode}
          onClick={() => {
            setConfigMode(option.mode);
            onSelectConfigMode(option.mode);
          }}
          className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
            configMode === option.mode
              ? "border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/10"
              : "border-light-border dark:border-dark-border"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex flex-row space-x-2">
              <span className="-mt-0.5"> {option.icon}</span>
              <h3 className="font-bold text-light-foreground dark:text-dark-foreground">
                {option.title}
              </h3>
            </div>

            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ConfigModeSelector;
