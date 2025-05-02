import { Outlet } from "@tanstack/react-router";
import Navbar from "../../../../components/Navbar";

function GamePage() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default GamePage;
