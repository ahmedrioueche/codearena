import React, { useState, useEffect } from "react";
import {
  Play,
  Settings,
  HelpCircle,
  Timer,
  Layout,
  ChevronLeft,
  ChevronRight,
  Notebook,
  Users,
} from "lucide-react";

interface ControlsMenuProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleBoard: () => void;
  onToggleNotePad: () => void;
  gameMode: "solo" | "battle";
  onTogglePlayers?: () => void;
}

const ControlsMenu: React.FC<ControlsMenuProps> = ({
  onToggleBoard,
  isSidebarCollapsed,
  onToggleSidebar,
  onToggleNotePad,
  gameMode,
  onTogglePlayers,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getButtons = () => {
    const baseButtons = [
      {
        icon: isSidebarCollapsed ? ChevronLeft : ChevronRight,
        action: onToggleSidebar,
        label: isSidebarCollapsed ? "Expand" : "Close",
        primary: false,
      },
      {
        icon: Play,
        action: () => console.log("Run code"),
        label: "Run Code",
        primary: true,
      },
      {
        icon: Layout,
        action: () => {
          onToggleBoard();
          !isSidebarCollapsed ? onToggleSidebar() : null;
        },
        label: "Board",
        primary: false,
      },
      {
        icon: Notebook,
        action: () => {
          onToggleNotePad();
          !isSidebarCollapsed ? onToggleSidebar() : null;
        },
        label: "NotePad",
        primary: false,
      },
      {
        icon: Timer,
        label: formatTime(timeRemaining),
        action: () => null,
        primary: false,
      },
      {
        icon: Settings,
        action: () => console.log("Open settings"),
        label: "Settings",
        primary: false,
      },
      {
        icon: HelpCircle,
        action: () => console.log("Show help"),
        label: "Help",
        primary: false,
      },
    ];

    // Add Players button for battle mode
    if (gameMode === "battle" && onTogglePlayers) {
      baseButtons.splice(4, 0, {
        icon: Users,
        action: () => {
          onTogglePlayers();
          !isSidebarCollapsed ? onToggleSidebar() : null;
        },
        label: "Players",
        primary: false,
      });
    }

    return baseButtons;
  };

  return (
    <div
      className={`transition-all duration-300 bg-light-background dark:bg-dark-background h-full flex flex-col gap-2 p-2 border-l border-light-border dark:border-dark-border ${
        isSidebarCollapsed ? "w-16" : "w-48"
      }`}
    >
      {getButtons().map(({ icon: Icon, action, label, primary }, index) => (
        <button
          key={index}
          onClick={action}
          className={`flex items-center justify-start w-full h-12 rounded-lg 
            ${
              primary
                ? "bg-light-primary dark:bg-dark-primary"
                : "bg-light-secondary dark:bg-dark-secondary"
            }
            text-white hover:opacity-90 transition-all duration-200
            ${isSidebarCollapsed ? "px-4" : "px-3"}
          `}
          aria-label={label}
        >
          <Icon
            size={20}
            className={`flex-shrink-0 ${
              !isSidebarCollapsed ? "mr-3" : "mx-auto"
            }`}
          />
          {!isSidebarCollapsed && (
            <span className="whitespace-nowrap overflow-hidden">{label}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ControlsMenu;
