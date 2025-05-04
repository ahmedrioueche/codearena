import { Sword, Target, Zap } from "lucide-react";
import { useAppContext } from "../../../../../../context/AppContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Profile = () => {
  const { currentUser } = useAppContext();

  // Rank color mapping
  const rankColors: Record<string, string> = {
    Noob: "bg-gray-500/20 text-gray-500",
    Beginner: "bg-blue-500/20 text-blue-500",
    Intermediate: "bg-purple-500/20 text-purple-500",
    Advanced: "bg-green-500/20 text-green-500",
    Expert: "bg-yellow-500/20 text-yellow-500",
    Master: "bg-orange-500/20 text-orange-500",
    Legend: "bg-red-500/20 text-red-500",
  };

  const userRank = currentUser.rank || "Noob";
  const rankClass = rankColors[userRank] || rankColors["Noob"];

  return (
    <div className="relative group perspective-1000">
      {/* Gradient background */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 blur-xl transition-all duration-1000 animate-gradient-xy"
        style={{
          background:
            "linear-gradient(135deg, #001122 0%, #001A2F 50%, #00253D 100%)",
        }}
      />

      {/* Main card content */}
      <div className="relative transform transition-all duration-500">
        <div
          className="p-6 rounded-xl backdrop-blur-sm border border-light-border dark:border-dark-border hover:shadow-lg transition-all duration-300"
          style={{
            background:
              "linear-gradient(135deg, #001122 0%, #001A2F 50%, #00253D 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Left Section - Avatar and Info */}
            <div className="flex flex-row md:items-center items-start space-x-6 mb-4 md:mb-0">
              {/* Developer Avatar with Rank Border */}
              <div className={`transform transition-all duration-500`}>
                <img
                  src="/icons/developer.png"
                  className="h-12 w-12 rounded-xl border-2 border-light-primary/30 dark:border-dark-primary/30"
                  alt="Developer Avatar"
                />
              </div>

              {/* Name and Details */}
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                    {currentUser.username}
                  </h2>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium w-fit ${rankClass}`}
                >
                  {userRank}
                </span>
              </div>
            </div>

            {/* Right Section - Battle Stats */}
            <div className="flex flex-row justify-around md:justify-end w-full md:w-auto items-center space-x-4 md:space-x-6">
              <Tippy content="Total Wins" placement="top" arrow={false}>
                <div className="flex flex-col items-center px-3 py-2 rounded-lg group transition-colors">
                  <Sword
                    size={24}
                    className="text-light-primary dark:text-dark-primary mb-1 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                    {currentUser.wins || 0}
                  </span>
                  <span className="text-xs text-light-secondary dark:text-dark-secondary">
                    Wins
                  </span>
                </div>
              </Tippy>

              <Tippy
                content="Accuracy Percentage"
                placement="top"
                arrow={false}
              >
                <div className="flex flex-col items-center px-3 py-2 rounded-lg group transition-colors">
                  <Target
                    size={24}
                    className="text-light-primary dark:text-dark-primary mb-1 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                    {currentUser.accuracy ? `${currentUser.accuracy}%` : "0%"}
                  </span>
                  <span className="text-xs text-light-secondary dark:text-dark-secondary">
                    Accuracy
                  </span>
                </div>
              </Tippy>

              <Tippy content="Total Points" placement="top" arrow={false}>
                <div className="flex flex-col items-center px-3 py-2 rounded-lg group transition-colors">
                  <Zap
                    size={24}
                    className="text-green-500 mb-1 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                    {currentUser.score || 0}
                  </span>
                  <span className="text-xs text-light-secondary dark:text-dark-secondary">
                    Points
                  </span>
                </div>
              </Tippy>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
