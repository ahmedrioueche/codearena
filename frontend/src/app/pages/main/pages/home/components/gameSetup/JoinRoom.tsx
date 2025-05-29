import { useState } from "react";
import Input from "../../../../../../../components/ui/InputField";
import { GameMode } from "../../../../../../../types/game/game";

function JoinRoom({
  onChange,
}: {
  gameMode: GameMode;
  onChange: (roomCode: string) => void;
}) {
  const [roomCode, setRoomCode] = useState("");
  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-light-foreground dark:text-dark-foreground">
        Room Code
      </label>
      <Input
        type="text"
        value={roomCode}
        onChange={handleRoomCodeChange}
        placeholder="Enter room code"
      />
    </div>
  );
}

export default JoinRoom;
