import { useState } from "react";
import { Sword, Target, Zap } from "lucide-react";
import { useAppContext } from "../../../../../../context/AppContext";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Alex DevPro",
    title: "Full Stack Master",
    mmr: "2.5k",
    techStack: ["React", "Node.js", "TypeScript"],
  });

  const { currentUser } = useAppContext();

  return (
    <div className="relative group perspective-1000">
      {/* Gradient background */}
      <div
        className="absolute inset-0 rounded-xl opacity-0  blur-xl transition-all duration-1000 animate-gradient-xy"
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
            <div className="flex flex-row items-center space-x-6 mb-4 md:mb-0">
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
                    {profile.name}
                  </h2>
                </div>
                <span className="px-2 py-0.5 bg-light-primary/10 dark:bg-dark-primary/20 rounded text-xs font-medium text-light-primary dark:text-dark-primary w-fit">
                  RANK 42
                </span>
              </div>
            </div>

            {/* Right Section - Battle Stats */}
            <div className="flex flex-row justify-around md:justify-end w-full md:w-auto items-center space-x-4 md:space-x-6">
              <div className="flex flex-col items-center px-3 py-2 rounded-lg group transition-colors">
                <Sword
                  size={24}
                  className="text-light-primary dark:text-dark-primary mb-1 group-hover:scale-110 transition-transform"
                />
                <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                  284
                </span>
                <span className="text-xs text-light-secondary dark:text-dark-secondary">
                  Wins
                </span>
              </div>

              <div className="flex flex-col items-center px-3 py-2 rounded-lg group transition-colors">
                <Target
                  size={24}
                  className="text-light-accent dark:text-dark-accent mb-1 group-hover:scale-110 transition-transform"
                />
                <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                  92%
                </span>
                <span className="text-xs text-light-secondary dark:text-dark-secondary">
                  Accuracy
                </span>
              </div>

              <div className="flex flex-col items-center px-3 py-2 rounded-lg group transition-colors">
                <Zap
                  size={24}
                  className="text-green-500 mb-1 group-hover:scale-110 transition-transform"
                />
                <span className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                  12.4k
                </span>
                <span className="text-xs text-light-secondary dark:text-dark-secondary">
                  Points
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
