import Navbar from "../../../components/Navbar";
import LeftSidebar from "./components/LeftSidebar";
import { Outlet, useMatchRoute } from "@tanstack/react-router";
import Home from "./pages/home/pages/Home";

const MainPage = () => {
  const matchRoute = useMatchRoute();
  const isRoot = matchRoute({ to: "/" });

  return (
    <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background font-stix">
      <Navbar />
      {/* Main Layout */}
      <div className="mt-24 flex flex-1 w-full gap-4 p-1 px-4">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Content */}
        <div
          className={`flex-1 px-4 transition-all duration-300 overflow-x-hidden
            ml-56`}
        >
          {isRoot ? <Home /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
