import React, { useState } from "react";
import {
  ChevronRight,
  LucideIcon,
  Trophy,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import { GameMode } from "../../../../../../types/game/game";

interface ModeCardProps {
  modeId: GameMode;
  mode: string;
  description: string[];
  icon: LucideIcon;
  playerCount?: number;
  rank?: string;
  onStartGame: (gameMode: GameMode) => void;
}

const ModeCard: React.FC<ModeCardProps> = ({
  modeId,
  mode,
  description,
  icon: Icon,
  playerCount,
  rank,
  onStartGame,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    onStartGame(modeId);
    setIsLoading(false);
  };

  // Helper function to get mode-specific stats
  const getModeStats = () => {
    switch (mode) {
      case "Solo Arena":
        return [
          { icon: Clock, value: "~20 min", label: "Avg. Session" },
          { icon: Award, value: "42", label: "Challenges" },
          { icon: Zap, value: "89%", label: "Success Rate" },
        ];
      case "Battle Arena":
        return [
          { icon: Clock, value: "~15 min", label: "Per Match" },
          { icon: Award, value: "5", label: "Win Streak" },
          { icon: Zap, value: "Gold", label: "Top League" },
        ];
      case "Collab Arena":
        return [
          { icon: Clock, value: "~45 min", label: "Avg. Session" },
          { icon: Award, value: "8", label: "Active Rooms" },
          { icon: Zap, value: "12", label: "Contributors" },
        ];
      default:
        return [];
    }
  };

  return (
    <div
      className="relative group perspective-1000 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onStartGame(modeId)}
    >
      {/* Previous gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-light-primary via-light-secondary to-light-primary dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary rounded-xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-1000 animate-gradient-xy" />

      {/* Main card content */}
      <div className="relative transform transition-all duration-500 hover:scale-102">
        <div className="p-6 rounded-xl bg-light-background/90 dark:bg-dark-background/90 backdrop-blur-sm border border-light-border dark:border-dark-border hover:shadow-xl transition-all duration-300">
          <div className="relative z-10">
            {/* Previous header section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`transform transition-all duration-500 ${
                    isHovered ? "scale-105 rotate-6" : ""
                  }`}
                >
                  <div
                    className="p-3 rounded-xl bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white shadow-md"
                    data-tooltip-id={`icon-tooltip-${mode}`}
                    data-tooltip-content={`Learn more about ${mode}`}
                  >
                    <Icon size={24} />
                    <Tooltip id={`icon-tooltip-${mode}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                  {mode}
                </h3>
              </div>
              {/* Status indicator */}
              {(playerCount || rank) && (
                <div className="text-sm text-light-foreground/60 dark:text-dark-foreground/60">
                  {playerCount && (
                    <span className="inline-flex items-center">
                      <div className="w-3 h-3 mb-0.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                      {playerCount.toLocaleString()} active
                    </span>
                  )}
                  {rank && (
                    <span className="inline-flex items-center">
                      <Trophy
                        size={16}
                        className="mr-2 text-light-accent dark:text-dark-accent"
                      />
                      {rank}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description with bullet points */}
            <div className="space-y-4 mb-6">
              {description.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary flex-shrink-0" />
                  <p className="text-light-foreground/80 dark:text-dark-foreground/80 transition-all duration-300 group-hover:text-light-foreground dark:group-hover:text-dark-foreground">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* New stats section */}
            <div className="grid grid-cols-3 gap-2 mb-6 pt-4 border-t border-light-border dark:border-dark-border">
              {getModeStats().map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-1">
                    <stat.icon
                      size={25}
                      className="text-light-primary dark:text-dark-primary"
                    />
                  </div>
                  <div className="font-medium text-light-foreground dark:text-dark-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-light-foreground/60 dark:text-dark-foreground/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Previous button */}
            <button
              onClick={handleStart}
              className="relative w-full mt-4 py-3 px-4 rounded-lg bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white 
                        overflow-hidden transition-all duration-300 transform hover:scale-101 hover:shadow-md
                        focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              disabled={isLoading}
              aria-label={`Start ${mode}`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <span>Start {mode}</span>
                    <ChevronRight
                      size={16}
                      className="transform transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeCard;
