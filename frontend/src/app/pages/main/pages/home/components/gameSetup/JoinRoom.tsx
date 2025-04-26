import React, { useState } from "react";
import Input from "../../../../../../../components/ui/Input";
import { GameMode } from "../../../../../../../types/general";
import { RoomSettings } from "./CreateRoom";

function JoinRoom({ gameMode }: { gameMode: GameMode }) {
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    roomName: "",
    maxPlayers: 2,
    teamSize: 1,
    roomCode: "",
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-light-foreground dark:text-dark-foreground">
        Room Code
      </label>
      <Input
        type="text"
        value={roomSettings.roomCode}
        onChange={(e) =>
          setRoomSettings({ ...roomSettings, roomCode: e.target.value })
        }
        placeholder="Enter room code"
        className="w-full p-3 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background"
      />
    </div>
  );
}

export default JoinRoom;
