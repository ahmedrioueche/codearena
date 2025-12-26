import { ChevronRight, LucideIcon, Star } from "lucide-react";
import { useState } from "react";
import { GameMode } from "../../../../../../types/game/game";

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
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 
        ${
          isImplemented
            ? "cursor-pointer hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)]"
            : "cursor-default opacity-60 grayscale-[0.5]"
        }
        backdrop-blur-md bg-white/5 border border-white/10 dark:bg-black/20 dark:border-white/5
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isImplemented && onStartGame(modeId)}
    >
      {/* Dynamic Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 transition-opacity duration-500
        ${isHovered ? "opacity-100" : "opacity-0"}`}
      />

      {/* Hover Border Glow */}
      <div
        className={`absolute inset-0 border-2 border-transparent transition-all duration-500 rounded-3xl ${
          isHovered && isImplemented ? "border-violet-500/30" : ""
        }`}
      />

      {/* Content Container */}
      <div className="relative p-8 h-full min-h-[420px] flex flex-col z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-5">
            {/* Icon Container */}
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                isImplemented
                  ? "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 group-hover:scale-110"
                  : "bg-slate-800"
              }`}
            >
              <Icon
                size={32}
                className={`${isImplemented ? "text-white" : "text-slate-500"}`}
              />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-violet-200 transition-all duration-300">
                {mode}
              </h3>
              <div className="flex items-center gap-2">
                {isImplemented ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    <span className="text-xs font-semibold text-green-300 uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-500/10 border border-slate-500/20 rounded-full backdrop-blur-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
                <p className="text-slate-300 leading-relaxed font-medium">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section with Glass Effect */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {getModeStats(modeId).map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-3 rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm group-hover:border-white/10 transition-colors"
            >
              <div className="text-lg font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 relative">
          {isImplemented ? (
            <button
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 overflow-hidden relative
                bg-white text-violet-950 hover:scale-[1.02] active:scale-[0.98]
                ${
                  isHovered
                    ? "shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
                    : ""
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Start Playing</span>
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </span>
              {/* Button Shine Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full transition-transform duration-1000 ${
                  isHovered ? "translate-x-full" : ""
                }`}
              />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 text-slate-500 font-semibold border border-white/5 cursor-not-allowed">
              <span>Under Development</span>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div
          className={`absolute top-0 right-0 p-8 transition-all duration-500 ${
            isHovered
              ? "opacity-100 scale-100 translate-x-0 translate-y-0"
              : "opacity-0 scale-75 translate-x-4 -translate-y-4"
          }`}
        >
          <Star
            size={24}
            className="text-yellow-300 fill-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.5)] animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default ModeCard;
