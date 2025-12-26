import { Outlet, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import useScreen from "../../../hooks/useScreen";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/home/pages/HomePage";

const MainPage = () => {
  const matchRoute = useMatchRoute();
  const isRoot = matchRoute({ to: "/" });
  const { isMobile } = useScreen();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);

  useEffect(() => {
    setIsSidebarCollapsed(isMobile);
  }, [isMobile]);

  return (
    <div className="relative min-h-screen font-stix">
      {/* Background Elements */}
      <div
        className="fixed inset-0 -z-10 bg-dark-background"
        style={{
          background: `
            radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.15), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(56, 189, 248, 0.15), transparent 25%),
            linear-gradient(180deg, #0f172a 0%, #020617 100%)
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-3xl transform -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)} />

        {/* Main Layout */}
        <div className="mt-24 flex w-full">
          {/* Floating Sidebar will position itself absolutely */}
          {!isSidebarCollapsed && (
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onClose={() => setIsSidebarCollapsed(false)}
            />
          )}

          {/* Center Content with proper spacing */}
          <div
            className={`flex-1 transition-all duration-300 ${
              isSidebarCollapsed ? "pl-4" : "pl-72"
            } pr-4`}
          >
            <div className="mx-auto">{isRoot ? <HomePage /> : <Outlet />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
