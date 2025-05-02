import { useState } from "react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { GameMode } from "../../../../../../types/game/game";
import { getModeStats } from "../../../../../../utils/helper";

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
      className={`relative h-auto md:h-96 rounded-2xl overflow-hidden transition-all duration-500 ${
        isHovered ? "scale-[1.01]" : ""
      } ${isImplemented ? "cursor-pointer" : "cursor-auto"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isImplemented && onStartGame(modeId)}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80" />

      {/* Animated Background Pattern */}
      <div
        className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${
          isHovered ? "opacity-30" : ""
        }`}
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 md:p-8 text-white">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Icon size={28} className="text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">{mode}</h3>
          </div>

          {isImplemented ? (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 w-fit">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Available</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20 w-fit">
              <span className="text-sm">Coming Soon</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-3 md:space-y-4 mt-6 md:mt-0 max-w-2xl">
          {description.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 md:mt-2.5 rounded-full bg-white flex-shrink-0" />
              <p className="text-base md:text-lg text-white/90">{point}</p>
            </div>
          ))}
        </div>

        {/* Stats and CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-8 gap-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 w-full md:w-auto">
            {getModeStats(modeId).map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl md:text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          {isImplemented && (
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 w-full md:w-auto justify-center ${
                isHovered
                  ? "bg-white text-purple-900 shadow-lg"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
              }`}
            >
              <span className="font-medium">Play Now</span>
              <ChevronRight
                size={20}
                className={`transition-transform ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeCard;
