import { useState } from "react";
import Input from "../../../../../../../components/ui/Input";
import { GameMode } from "../../../../../../../types/game/game";

export interface RoomSettings {
  roomName: string;
  maxPlayers: number;
  teamSize: number;
  roomCode: string;
}

const CreateRoom = ({}: { gameMode: GameMode }) => {
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    roomName: "codeArena_33",
    maxPlayers: 2,
    teamSize: 1,
    roomCode: "42453",
  });

  return (
    <div className="space-y-6">
      {/* Room Name Input */}
      <div className="flex flex-col md:flex-row md:justify-between w-full gap-4">
        <div className="space-y-2 flex-1">
          <label className="block text-base font-medium text-light-foreground dark:text-dark-foreground">
            Room Name
          </label>
          <Input
            type="text"
            value={roomSettings.roomName}
            onChange={(e) =>
              setRoomSettings({ ...roomSettings, roomName: e.target.value })
            }
            placeholder="Enter room name"
            className="w-full text-base"
          />
        </div>
        <div className="space-y-2 flex-1">
          <label className="block text-base font-medium text-light-foreground dark:text-dark-foreground">
            Room Id
          </label>
          <Input
            type="text"
            value={roomSettings.roomCode}
            onChange={(e) =>
              setRoomSettings({ ...roomSettings, roomCode: e.target.value })
            }
            placeholder="Room code"
            className="w-full text-base"
          />
        </div>
      </div>
    </div>
  );
};
export default CreateRoom;
