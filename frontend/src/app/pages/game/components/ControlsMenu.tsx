import React, { useState, useEffect } from "react";
import {
  Settings,
  Timer,
  Layout,
  ChevronLeft,
  ChevronRight,
  Notebook,
  Users,
  Redo,
  HelpCircle,
  Hammer,
  MessageCircle,
} from "lucide-react";
import Tooltip, {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/ToolTip";
import useScreen from "../../../../hooks/useScreen";
import { GameMode } from "../../../../types/game/game";

interface ButtonConfig {
  id: string;
  icon: React.ElementType;
  action: () => void;
  label: string;
  primary: boolean;
  hideOnModes?: GameMode[];
}

interface ControlsMenuProps {
  gameMode: GameMode;
  isCollapsed: boolean;
  isGameStarted: boolean;
  isOpenOnMobile: boolean;
  onTimerChange: (timer: number) => void;
  onGetNewProblem: () => void;
  onToggleComponent: (component: string) => void;
}

const ControlsMenu: React.FC<ControlsMenuProps> = ({
  gameMode,
  isCollapsed,
  isGameStarted,
  isOpenOnMobile,
  onTimerChange,
  onGetNewProblem,
  onToggleComponent,
}) => {
  const [timer, setTimer] = useState(0);
  const { isMobile } = useScreen();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isGameStarted) {
      timer = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameStarted]);

  useEffect(() => {
    onTimerChange(timer);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleToggle = () => {
    if (!isMobile) {
      onToggleComponent("controlsMenu");
      return;
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsOpen((prev) => !prev);
  }, [isOpenOnMobile]);

  const getButtons = () => {
    const baseButtons: ButtonConfig[] = [
      {
        id: "expand",
        icon: isMobile
          ? ChevronRight
          : isCollapsed
          ? ChevronLeft
          : ChevronRight,
        action: () => {
          handleToggle();
        },
        label: isCollapsed ? (isMobile ? "Close" : "Expand") : "Close",
        primary: false,
        hideOnModes: ["collab"]
      },
      {
        id: "timer",
        icon: Timer,
        label: formatTime(timer),
        action: () => {},
        primary: false,
      },
      {
        id: "test",
        icon: Hammer,
        action: () => {
          onToggleComponent("testCases");
        },
        label: "Test",
        primary: false,
      },
      {
        id: "chat",
        icon: MessageCircle,
        action: () => {
          onToggleComponent("chat");
        },
        label: "Chat",
        primary: false,
      },
      {
        id: "board",
        icon: Layout,
        action: () => {
          onToggleComponent("board");
        },
        label: "Board",
        primary: false,
      },
      {
        id: "notebook",
        icon: Notebook,
        action: () => {
          onToggleComponent("notepad");
        },
        label: "NotePad",
        primary: false,
      },
      {
        id: "settings",
        icon: Settings,
        action: () => {
          onToggleComponent("settings");
        },
        label: "Settings",
        primary: false,
      },
      {
        id: "help",
        icon: HelpCircle,
        action: () => {
          onToggleComponent("help");
        },
        label: "Help",
        primary: false,
      },
      {
        id: "players",
        icon: Users,
        action: () => {
          onToggleComponent("players");
        },
        label: "Players",
        primary: false,
        hideOnModes: ["solo"]
      },
      {
        id: "new-problem",
        icon: Redo,
        action: () => {
          onGetNewProblem();
        },
        label: "New",
        primary: true,
      },
    ];

    // Filter buttons based on mobile and game mode
    let filteredButtons = baseButtons;
    
    // Filter out buttons that should be hidden on current game mode
    filteredButtons = filteredButtons.filter(
      (button) => !button.hideOnModes?.includes(gameMode)
    );
    
    // Filter out board button on mobile
    if (isMobile) {
      filteredButtons = filteredButtons.filter((button) => button.id !== "board");
    }

    return filteredButtons;
  };
  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <div
        className={`relative h-full transition-all duration-300 flex flex-col space-y-2 p-2 overflow-y-auto overflow-x-hidden ${
          isCollapsed ? "w-18" : "min-w-[200px] max-w-[250px]"
        }`}
      >
        {getButtons().map(({ id, icon: Icon, action, label, primary }) => (
          <Tooltip key={id}>
            <TooltipTrigger>
              <button
                onClick={action}
                className={`flex items-center justify-start w-full h-12 rounded-lg 
                ${
                  primary
                    ? "bg-light-primary dark:bg-dark-primary"
                    : "bg-light-secondary dark:bg-dark-secondary"
                }
                text-white hover:opacity-90 transition-all duration-200
                ${isCollapsed ? "px-4" : "px-3"}
              `}
                aria-label={label}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    !isCollapsed ? "mr-3" : "mx-auto"
                  }`}
                />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden">
                    {label}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent>{label}</TooltipContent>}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ControlsMenu;
