import { useState } from "react";
import { ChevronRight, Play, Star } from "lucide-react";

// Mock types for demo purposes
type GameMode = string;
type LucideIcon = any;

const getModeStats = (modeId: GameMode) => [
  { value: "4.8", label: "Rating" },
  { value: "1.2K", label: "Players" },
  { value: "15min", label: "Duration" },
];

interface ModeCardProps {
  modeId: GameMode;
  mode: string;
  description: string[];
  icon: LucideIcon;
  isImplemented: boolean;
  onStartGame: (gameMode: GameMode) => void;
}

const ModeCard = ({
  modeId,
  mode,
  description,
  icon: Icon,
  isImplemented,
  onStartGame,
}: ModeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative bg-white dark:bg-dark-secondary border border-light-border dark:border-dark-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-light-shadow dark:hover:shadow-dark-shadow ${
        isHovered ? "scale-[1.02] -translate-y-2" : ""
      } ${isImplemented ? "cursor-pointer" : "cursor-default opacity-75"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isImplemented && onStartGame(modeId)}
    >
      {/* Gradient overlay for hover effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-light-primary/5 via-light-secondary/5 to-light-accent/5 dark:from-dark-primary/10 dark:via-dark-secondary/10 dark:to-dark-accent/10 transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content Container */}
      <div className="relative p-8 h-full min-h-[420px] flex flex-col">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div
              className={`p-4 rounded-2xl transition-all duration-300 ${
                isImplemented
                  ? "bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Icon
                size={32}
                className={`${
                  isImplemented
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-1">
                {mode}
              </h3>
              <div className="flex items-center gap-2">
                {isImplemented ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Available Now
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="flex-1 mb-8">
          <div className="space-y-4">
            {description.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 group/item">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-light-primary dark:bg-dark-primary flex-shrink-0 transition-all duration-300 group-hover/item:scale-125" />
                <p className="text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-6">
            {getModeStats(modeId).map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-3 rounded-xl bg-light-background/50 dark:bg-dark-background/50 border border-light-border dark:border-dark-border"
              >
                <div className="text-xl font-bold text-light-primary dark:text-dark-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {isImplemented ? (
            <button
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                isHovered
                  ? "bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary text-white shadow-lg transform scale-[1.02]"
                  : "bg-light-background dark:bg-dark-background border-2 border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary hover:bg-light-primary/5 dark:hover:bg-dark-primary/5"
              }`}
            >
              <Play
                size={20}
                className={`transition-transform ${
                  isHovered ? "scale-110" : ""
                }`}
              />
              <span>Start Playing</span>
              <ChevronRight
                size={20}
                className={`transition-transform ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold cursor-not-allowed">
              <span>Coming Soon</span>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div
          className={`absolute top-4 right-4 transition-all duration-500 ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        >
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="text-light-accent dark:text-dark-accent animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-light-primary via-light-secondary to-light-accent dark:from-dark-primary dark:via-dark-secondary dark:to-dark-accent transition-opacity duration-500 ${
          isHovered && isImplemented ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ModeCard;
