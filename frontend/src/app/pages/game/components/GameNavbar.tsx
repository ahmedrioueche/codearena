import {
  User,
  Cog,
  Bell,
  Fullscreen,
  Minimize,
  MoreVertical,
  BookOpen,
  Sliders,
} from "lucide-react";
import logo from "/images/logo.svg";
import { RootState, settingsActions } from "../../../../store";
import { GameMode } from "../../../../types/game/game";
import { useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import useScreen from "../../../../hooks/useScreen";
import { controlActions } from "../../../../store";
import { controlSlice } from "../../../../store/slices/control";
import { useSelector } from "react-redux";

interface GameNavbarProps {
  gameMode: GameMode;
}

const GameNavbar = ({ gameMode }: GameNavbarProps) => {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useScreen();
  const isProblemOpenOnMobile = useSelector(
    (state: RootState) => state.problemControl.isProblemToggled
  );
  const isControlsOpenOnMobile = useSelector(
    (state: RootState) => state.problemControl.isControlsToggled
  );

  settingsActions.setTheme("dark");

  const handleToggleProblem = () => {
    controlActions.toggleProblem();
    if (isControlsOpenOnMobile) controlActions.toggleControls();
  };

  const handleToggleControlsMenu = () => {
    controlActions.toggleControls();
    if (isProblemOpenOnMobile) controlActions.toggleProblem();
  };

  const handleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuButton = document.getElementById("mobile-menu-button");

      if (
        mobileMenu &&
        !mobileMenu.contains(e.target as Node) &&
        mobileMenuButton &&
        !mobileMenuButton.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { icon: Bell, label: "Notifications" },
    { icon: Cog, label: "Settings" },
    { icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed p-0 top-0 left-0 w-full bg-light-background dark:bg-dark-background border-b border-white/10 shadow-lg z-50">
      <div className="w-full px-6 py-4 flex items-center justify-between">
        <div className="flex flex-row space-x-2 items-center">
          <img src={logo} alt="CodeArena" className="h-9 w-9" />
          <h1 className="md:text-2xl text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing">
            CodeArena
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {!isMobile && (
            <button
              onClick={handleFullScreen}
              className="text-light-primary dark:text-dark-primary hover:scale-105 hover:text-light-secondary dark:hover:text-dark-secondary transition-colors"
            >
              {isFullScreen ? (
                <Minimize className="w-6 h-6" />
              ) : (
                <Fullscreen className="w-6 h-6" />
              )}
            </button>
          )}

          {isMobile && (
            <div className="flex items-center space-x-4">
              {/* Toggle Problem Button */}
              <button
                onClick={() => {
                  handleToggleProblem();
                }}
                className="text-light-primary dark:text-dark-text-primary hover:scale-105 hover:text-light-secondary dark:hover:text-dark-secondary transition-colors"
              >
                <BookOpen className="w-6 h-6" />
              </button>

              {/* Toggle Controls Button */}
              <button
                onClick={() => {
                  handleToggleControlsMenu();
                }}
                className="text-light-primary dark:text-dark-primary hover:scale-105 hover:text-light-secondary dark:hover:text-dark-secondary transition-colors"
              >
                <Sliders className="w-6 h-6" />
              </button>

              {/* Mobile Menu Button */}
              <div className="relative">
                <button
                  id="mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="mt-1 text-light-primary dark:text-dark-primary hover:scale-105 hover:text-light-secondary dark:hover:text-dark-secondary transition-colors"
                >
                  <MoreVertical className="w-6 h-6" />
                </button>

                {isMobileMenuOpen && (
                  <div
                    id="mobile-menu"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-light-border dark:border-dark-border rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      {menuItems.map(({ icon: Icon, label }) => (
                        <button
                          key={label}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full px-4 py-2 flex items-center space-x-2 text-black dark:text-white hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{label}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleFullScreen();
                        }}
                        className="w-full px-4 py-2 flex items-center space-x-2 text-black dark:text-white hover:bg-light-accent dark:hover:bg-dark-accent transition-colors"
                      >
                        {isFullScreen ? (
                          <Minimize className="w-5 h-5" />
                        ) : (
                          <Fullscreen className="w-5 h-5" />
                        )}
                        <span>Fullscreen</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isMobile &&
            menuItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="text-light-primary dark:text-dark-primary hover:text-light-secondary dark:hover:text-dark-secondary transition-colors"
              >
                <Icon className="w-6 h-6" />
              </button>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default GameNavbar;
