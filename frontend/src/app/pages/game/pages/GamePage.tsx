import { Outlet, useParams } from "@tanstack/react-router";
import GameNavbar from "../components/GameNavbar";
import { GameMode } from "../../../../types/game/game";

function GamePage() {
  const params = useParams({ strict: false });

  const gameModeFromUrl = params["*"];

  const validatedGameMode: GameMode = (
    ["solo", "battle", "collab"].includes(gameModeFromUrl)
      ? gameModeFromUrl
      : "solo"
  ) as GameMode;

  return (
    <div>
      <GameNavbar gameMode={validatedGameMode} />
      <Outlet />
    </div>
  );
}

export default GamePage;
