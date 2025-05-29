import RoomSettings from "../components/RoomSettings";
import RoomMain from "../components/RoomMain";
import { settingsActions } from "../../../../../../store";
import { useEffect, useState } from "react";
import useScreen from "../../../../../../hooks/useScreen";
import { useRoom } from "../hooks/useRoom";
import { useAppContext } from "../../../../../../context/AppContext";
import { useRealtime } from "../../../hooks/useRealTime";
import { EVENTS } from "../../../../../../constants/events";
import toast from "react-hot-toast";
import { User } from "../../../../../../types/user";
import { GameSettings } from "../../../../../../types/game/game";
import { RoomApi } from "../../../../../../api/game/room";

function RoomPage() {
  settingsActions.setTheme("dark");
  const { currentUser } = useAppContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isMobile } = useScreen();
  const {
    currentRoom,
    validateRoom,
    addUser,
    removeUser,
    updateGameSettings,
    setPlayerReady,
    leaveRoom,
  } = useRoom();

  useEffect(() => {
    validateRoom();
  }, []);

  useRealtime({
    channelName: `room-${currentRoom.code}`,
    events: {
      [EVENTS.JOINED_ROOM]: (user: User) => {
        if (user.username !== currentUser.username) {
          toast.success(`${user.username} just joined!`);
          addUser(user);
        }
      },
      [EVENTS.LEFT_ROOM]: (user: User) => {
        if (user.username !== currentUser.username) {
          toast.error(`${user.username} left`);
          removeUser(user._id);
        }
      },
      [EVENTS.SETTINGS_UPDATED]: (settings: GameSettings) => {
        if (currentRoom.adminId !== currentUser._id) {
          updateGameSettings(settings);
        }
      },
      [EVENTS.PLAYER_READY]: (data: { userId: string }) => {
        const user = currentRoom.users.find(u => u._id === data.userId);
        setPlayerReady(data.userId);
        if (data.userId !== currentUser._id && user) {
          toast.success(`${user.username} is ready!`);
        }
      }
    }
  });
  
  const handleSettingsChange = async (settings: GameSettings) => {
    await RoomApi.updateRoomGameSettings(currentRoom.code, settings);
  };

  useEffect(() => {
    let isUnmounted = false;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isUnmounted) {
        leaveRoom();

        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isUnmounted = true;
      // For normal navigation (not tab closing)
      if (!isUnmounted && currentRoom?.code && currentUser?._id) {
        leaveRoom();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentRoom.code, currentUser._id, leaveRoom]);

  return (
    <div
      className={`${
        isMobile ? "mt-4" : ""
      } bg-light-background dark:bg-dark-background min-h-screen flex`}
    >
      <RoomSettings
        room={currentRoom}
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        onChange={handleSettingsChange}
      />

      <div
        className={`flex flex-1 flex-col ${isMobile ? "p-2" : "p-4"} pt-16 ${
          isMobile ? "" : "ml-[25%]"
        }`}
        style={{ zoom: 0.9 }}
      >
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="lg:hidden p-4 space-y-4 relative z-0">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity relative z-0"
            >
              Room Settings
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <RoomMain room={currentRoom} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
