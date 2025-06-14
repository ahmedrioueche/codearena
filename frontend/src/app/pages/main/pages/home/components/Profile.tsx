import { Sword, Target, Zap } from "lucide-react";
import { useAppContext } from "../../../../../../context/AppContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Profile = () => {
  const { currentUser } = useAppContext();

  // Rank color mapping with updated glow effects
  const rankColors: Record<string, { bg: string; text: string; glow: string }> =
    {
      Noob: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        glow: "shadow-gray-500/20",
      },
      Beginner: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        glow: "shadow-blue-500/20",
      },
      Intermediate: {
        bg: "bg-purple-500/20",
        text: "text-purple-400",
        glow: "shadow-purple-500/20",
      },
      Advanced: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        glow: "shadow-green-500/20",
      },
      Expert: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        glow: "shadow-yellow-500/20",
      },
      Master: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        glow: "shadow-orange-500/20",
      },
      Legend: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        glow: "shadow-red-500/20",
      },
    };

  const userRank = currentUser.rank || "Noob";
  const rankClass = rankColors[userRank] || rankColors["Noob"];

  return (
    <div className="dark:bg-dark-secondary border border-light-border dark:border-dark-border rounded-3xl relative group perspective-1000 h-full">
      {/* Main Card Content */}
      <div className="relative h-full p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-white/20 overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`p-1 rounded-xl ${rankClass.glow} shadow-lg`}>
              <img
                src="/icons/developer.png"
                className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl border-2 border-white/30"
                alt="Developer Avatar"
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {currentUser.username}
              </h2>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mt-1 inline-block ${rankClass.bg} ${rankClass.text}`}
              >
                {userRank}
              </span>
            </div>
          </div>

          {/* Status Indicator - Always top right */}
          <div className="absolute top-4 right-4 sm:static flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-white/90">Active</span>
          </div>
        </div>

        {/* Stats Row - Single row on mobile, with smaller size */}
        <div className="flex flex-row justify-between sm:justify-start items-center gap-2 sm:gap-4 md:gap-6 mt-6 sm:mt-8">
          <Tippy content="Total Wins" placement="top" arrow={false}>
            <div className="bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <div className="p-1 sm:p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <Sword size={16} className="text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold text-white">
                  {currentUser.wins || 0}
                </span>
                <span className="text-[10px] sm:text-xs text-white/70">
                  Wins
                </span>
              </div>
            </div>
          </Tippy>

          <Tippy content="Accuracy Percentage" placement="top" arrow={false}>
            <div className="bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <div className="p-1 sm:p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <Target size={16} className="text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold text-white">
                  {currentUser.accuracy ? `${currentUser.accuracy}%` : "0%"}
                </span>
                <span className="text-[10px] sm:text-xs text-white/70">
                  Accuracy
                </span>
              </div>
            </div>
          </Tippy>

          <Tippy content="Total Points" placement="top" arrow={false}>
            <div className="bg-white/5 p-2 sm:p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
              <div className="p-1 sm:p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <Zap size={16} className="text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold text-white">
                  {currentUser.score || 0}
                </span>
                <span className="text-[10px] sm:text-xs text-white/70">
                  Points
                </span>
              </div>
            </div>
          </Tippy>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl -z-10" />
        <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full filter blur-3xl -z-10" />
      </div>
    </div>
  );
};

export default Profile;
