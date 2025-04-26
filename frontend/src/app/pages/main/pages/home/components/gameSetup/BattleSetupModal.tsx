import React, { useState } from "react";
import { X, Swords } from "lucide-react";
import Button from "../../../../../../../components/ui/Button";
import QuickMatch from "./QuickMatch";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import ConfigModeSelector from "./ConfigModeSelector";
import { CONFIG_MODES, ConfigMode } from "../../../../../../../types/game/game";

const BattleModeSetupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [configMode, setConfigMode] = useState<ConfigMode>(CONFIG_MODES.SEARCH);
  const [isSeachStarted, setIsSeachStarted] = useState(false);

  const handleSubmit = () => {
    if (configMode === CONFIG_MODES.SEARCH) {
      setIsSeachStarted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-light-background dark:bg-dark-background rounded-2xl shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/10 transition-colors"
        >
          <X className="w-5 h-5 text-light-primary dark:text-dark-primary" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center space-x-2">
            <Swords className="w-6 h-6 text-light-primary dark:text-dark-primary" />
            <h2 className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
              Battle Arena
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <ConfigModeSelector
            gameMode="battle"
            onSelectConfigMode={(configMode) => setConfigMode(configMode)}
          />
          {configMode === CONFIG_MODES.JOIN ? (
            <JoinRoom gameMode={"battle"} />
          ) : configMode === CONFIG_MODES.CREATE ? (
            <CreateRoom gameMode="battle" />
          ) : (
            <QuickMatch gameMode="battle" isSearchStarted={isSeachStarted} />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-light-border dark:border-dark-border">
          <div className="flex justify-end space-x-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleSubmit();
              }}
              className="flex items-center space-x-2 text-white"
            >
              <Swords className="w-5 h-5 " />
              <span>
                {configMode === CONFIG_MODES.SEARCH
                  ? isSeachStarted
                    ? "Start Game"
                    : "Find Opponents"
                  : configMode === CONFIG_MODES.CREATE
                  ? "Create Room"
                  : "Join Room"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleModeSetupModal;
