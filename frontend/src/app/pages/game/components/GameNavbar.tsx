import {
  LogOut,
  Fullscreen,
  Minimize,
  MoreVertical,
  BookOpen,
  Sliders,
} from "lucide-react";
import logo from "/images/logo.svg";
import { RootState, settingsActions } from "../../../../store";
import { GameMode } from "../../../../types/game/game";
import { useState, useEffect } from "react";
import useScreen from "../../../../hooks/useScreen";
import { controlActions } from "../../../../store";
import { useSelector } from "react-redux";
import { logout } from "../../../../api/auth";
import { APP_PAGES } from "../../../../constants/navigation";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";

interface GameNavbarProps {
  gameMode: GameMode;
}

const GameNavbar = ({}: GameNavbarProps) => {
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

  const handleLogout = async () => {
    try {
      await logout();
      location.href = APP_PAGES.login.route;
    } catch (e) {
      console.log(e);
      toast.error(`Logout failed, please try again`);
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
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      tooltip: "Logout",
    },
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
              className="text-light-primary dark:text-dark-primary hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
              title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
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
                className="text-light-primary dark:text-dark-primary hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
                title="Problem"
              >
                <BookOpen className="w-6 h-6" />
              </button>

              {/* Toggle Controls Button */}
              <button
                onClick={() => {
                  handleToggleControlsMenu();
                }}
                className="text-light-primary dark:text-dark-primary hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
                title="Controls"
              >
                <Sliders className="w-6 h-6" />
              </button>

              {/* Mobile Menu Button */}
              <div className="relative">
                <button
                  id="mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="mt-1 text-light-primary dark:text-dark-primary hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
                  title="Menu"
                >
                  <MoreVertical className="w-6 h-6" />
                </button>

                {isMobileMenuOpen && (
                  <div
                    id="mobile-menu"
                    className="absolute right-0 mt-2 w-48 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      {menuItems.map(
                        ({ icon: Icon, label, action, tooltip }) => (
                          <button
                            key={tooltip}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              action();
                            }}
                            className="w-full px-4 py-2 flex items-center space-x-2 text-black dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                          </button>
                        )
                      )}
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleFullScreen();
                        }}
                        className="w-full px-4 py-2 flex items-center space-x-2 text-black dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        title={
                          isFullScreen ? "Exit fullscreen" : "Enter fullscreen"
                        }
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
            menuItems.map(({ icon: Icon, action, tooltip }) => (
              <Tippy
                key={tooltip}
                content={tooltip}
                animation="scale"
                delay={[100, 0]}
              >
                <button
                  onClick={action}
                  className="text-light-primary dark:text-dark-primary hover:scale-110 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <Icon className="w-6 h-6" />
                </button>
              </Tippy>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default GameNavbar;
