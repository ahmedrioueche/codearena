import { useState } from "react";
import Navbar from "../../../components/Navbar";
import LeftSidebar from "./components/LeftSidebar";
import { Outlet, useMatchRoute } from "@tanstack/react-router";
import Home from "./pages/home/pages/Home";

const MainPage = () => {
  const matchRoute = useMatchRoute();
  const isRoot = matchRoute({ to: "/" });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const closeSidebar = () => setIsSidebarCollapsed(true);

  return (
    <div className="relative min-h-screen font-stix overflow-hidden">
      {/* Background Elements */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(135deg, 
              #000E1D 0%,
              #00172A 50%,
              #002137 100%
            ),
            radial-gradient(
              ellipse at 20% 30%,
              rgba(0, 40, 80, 0.15) 0%,
              transparent 40%
            ),
            radial-gradient(
              ellipse at 80% 70%,
              rgba(0, 30, 60, 0.1) 0%,
              transparent 40%
            ),
            url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjMDAwMDAwIiBvcGFjaXR5PSIwLjA1Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDZMNiAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMwMDIxMzciIHN0cm9rZS13aWR0aD0iMC4yNSIgb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')
          `,
          backgroundBlendMode: "overlay",
          boxShadow: "inset 0 0 60px rgba(0, 15, 30, 0.6)",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Main Layout */}
        <div className="mt-24 flex flex-1 w-full gap-4 p-1 md:px-4 px-2">
          {/* Sidebar Overlay */}
          <LeftSidebar
            isCollapsed={isSidebarCollapsed}
            onClose={closeSidebar}
          />

          {/* Center Content */}
          <div className="flex-1 md:px-4 px-2 transition-all duration-300 overflow-x-hidden">
            {isRoot ? <Home /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
