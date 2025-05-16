import { useState } from "react";
import Input from "../../../../../../../components/ui/InputField";
import { GameMode } from "../../../../../../../types/game/game";
import { RoomSettings } from "../../../../../../../types/game/room";

function JoinRoom({
  gameMode,
  onChange,
}: {
  gameMode: GameMode;
  onChange: (roomSettings: RoomSettings) => void;
}) {
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    gameMode: gameMode,
    roomName: "",
    maxPlayers: 2,
    teamSize: 1,
    roomCode: "",
  });

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = {
      ...roomSettings,
      roomCode: e.target.value,
    };
    setRoomSettings(updatedSettings);
    onChange(updatedSettings);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-light-foreground dark:text-dark-foreground">
        Room Code
      </label>
      <Input
        type="text"
        value={roomSettings.roomCode}
        onChange={handleRoomCodeChange}
        placeholder="Enter room code"
      />
    </div>
  );
}

export default JoinRoom;
