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

function RoomPage() {
  settingsActions.setTheme("dark");
  const { currentUser, currentRoom } = useAppContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isMobile } = useScreen();
  const { users, validateRoom, addUser, removeUser } = useRoom();

  useEffect(() => {
    validateRoom();
  }, []);

  useRealtime({
    channelName: `room-${currentRoom.code}`,
    eventName: EVENTS.JOINED_ROOM,
    onEvent: (user: User) => {
      console.log("Received data:", user);
      if (user.username !== currentUser.username)
        toast.success(`${user.username} just joined!`);
      addUser(user);
    },
  });

  useRealtime({
    channelName: `room-${currentRoom.code}`,
    eventName: EVENTS.LEFT_ROOM,
    onEvent: (user: User) => {
      console.log("Received data:", user);
      if (user.username !== currentUser.username)
        toast.error(`${user.username} left`);
      removeUser(user._id);
    },
  });

  return (
    <div
      className={`${
        isMobile ? "mt-4" : ""
      } bg-light-background dark:bg-dark-background min-h-screen flex`}
    >
      <RoomSettings isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />

      {/* Main Content Section */}
      <div
        className={`flex flex-1 flex-col ${isMobile ? "p-2" : "p-4"} pt-16 ${
          isMobile ? "" : "ml-[25%]"
        }`}
        style={{ zoom: 0.9 }}
      >
        {" "}
        {/* lg:ml-80 accounts for the width of RoomSettings on larger screens */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Mobile: Room Settings Button and Room ID */}
          <div className="lg:hidden p-4 space-y-4 relative z-0">
            {" "}
            {/* Added z-0 */}
            {/* Room Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity relative z-0"
            >
              Room Settings
            </button>
          </div>

          {/* Centered Main Section */}
          <div className="flex-1 flex justify-center items-center">
            <RoomMain room={currentRoom} users={users} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
