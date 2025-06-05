import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Sidebar from "./components/Sidebar";
import { Outlet, useMatchRoute } from "@tanstack/react-router";
import HomePage from "./pages/home/pages/HomePage";
import useScreen from "../../../hooks/useScreen";

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
