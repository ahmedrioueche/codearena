import RoomSettings from "../components/RoomSettings";
import RoomOptions from "../components/RoomOptions";
import RoomMain from "../components/RoomMain";
import { settingsActions } from "../../../../../../store";
import { Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import useScreen from "../../../../../../hooks/useScreen";
import { useRoom } from "../hooks/useRoom";
import { useAppContext } from "../../../../../../context/AppContext";

function RoomPage() {
  settingsActions.setTheme("dark");
  const { currentRoom } = useAppContext();
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isMobile } = useScreen();
  const roomCode = currentRoom.code;
  const { validateRoom } = useRoom();

  useEffect(() => {
    validateRoom();
  }, []);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room ID:", err);
    }
  };

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
            {/* Room ID Section */}
            <div className="p-4 bg-white dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg relative z-0">
              {" "}
              {/* Added z-0 */}
              <div className="flex items-center justify-between">
                <span className="text-light-foreground dark:text-dark-foreground font-mono">
                  {roomCode}
                </span>
                <button
                  onClick={handleCopyRoomId}
                  className="flex items-center gap-2 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-md hover:opacity-90 transition-opacity relative z-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy ID"}
                </button>
              </div>
            </div>
          </div>

          {/* Centered Main Section */}
          <div className="flex-1 flex justify-center items-center">
            <RoomMain />
          </div>

          {/* Right-Side Options (Hidden on Mobile) */}
          <div className="hidden lg:block w-1/4">
            <RoomOptions roomCode={roomCode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
