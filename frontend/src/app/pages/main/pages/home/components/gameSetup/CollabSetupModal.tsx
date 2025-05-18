import React, { useEffect, useState } from "react";
import { X, Users } from "lucide-react";
import Button from "../../../../../../../components/ui/Button";
import QuickMatch from "./QuickMatch";
import JoinRoom from "./JoinRoom";
import ConfigModeSelector from "./ConfigModeSelector";
import { CONFIG_MODES, ConfigMode } from "../../../../../../../types/game/game";
import { RoomApi } from "../../../../../../../api/game/room";
import { useAppContext } from "../../../../../../../context/AppContext";
import toast from "react-hot-toast";
import { router } from "../../../../../../../routers";
import { APP_PAGES } from "../../../../../../../constants/navigation";

const CollabModeSetupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [configMode, setConfigMode] = useState<ConfigMode>(CONFIG_MODES.SEARCH);
  const [isSeachStarted, setIsSeachStarted] = useState(false);
  const { setCurrentRoom } = useAppContext();
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      setConfigMode(CONFIG_MODES.SEARCH);
      setIsSeachStarted(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (configMode === CONFIG_MODES.SEARCH) {
      setIsSeachStarted(true);
    }
    if (configMode === CONFIG_MODES.CREATE) {
      try {
        const res = await RoomApi.createRoom();
        if (res) setCurrentRoom(res.room);
        toast.success(`Room created`);
        router.navigate({ to: APP_PAGES.game.room.route });
      } catch (e) {
        console.log("error", e);
        toast.error(`Error creating room`);
      }
    }
    if (configMode === CONFIG_MODES.JOIN) {
      try {
        const res = await RoomApi.joinRoom(roomCode);
        if (res) setCurrentRoom(res.room);
        toast.success(`Joined room with code ${roomCode}`);
        router.navigate({ to: APP_PAGES.game.room.route });
      } catch (e) {
        console.log("error", e);
        toast.error(`Error joining room`);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] bg-light-background dark:bg-dark-background rounded-2xl shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, #001122 0%, #001A2F 50%, #00253D 100%)",
        }}
      >
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
            <Users className="w-6 h-6 text-light-primary dark:text-dark-primary" />
            <h2 className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
              Collab Arena
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          <ConfigModeSelector
            gameMode="collab"
            onSelectConfigMode={(configMode) => setConfigMode(configMode)}
          />
          {configMode === CONFIG_MODES.JOIN ? (
            <JoinRoom
              gameMode={"collab"}
              onChange={(roomSettings) => setRoomCode(roomSettings.roomCode)}
            />
          ) : configMode === CONFIG_MODES.CREATE ? (
            <></>
          ) : (
            <QuickMatch gameMode="collab" isSearchStarted={isSeachStarted} />
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
              <Users className="w-5 h-5 " />
              <span>
                {configMode === CONFIG_MODES.SEARCH
                  ? isSeachStarted
                    ? "Start Game"
                    : "Find Developers"
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

export default CollabModeSetupModal;
