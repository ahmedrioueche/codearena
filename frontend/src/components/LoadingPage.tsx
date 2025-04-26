import { Loader2 } from "lucide-react";
import { FC } from "react";
import { asteroids, stars } from "../constants/general";

const LoadingScreen: FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0B1026] via-[#1B2349] to-[#0B1026] overflow-hidden p-4 flex items-center justify-center">
      {/* Static Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        />
      ))}

      {/* Static Asteroids */}
      {asteroids.map((asteroid) => (
        <div
          key={asteroid.id}
          className="absolute bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg opacity-30"
          style={{
            width: `${asteroid.size}px`,
            height: `${asteroid.size}px`,
            top: asteroid.top,
            left: asteroid.left,
            transform: `rotate(${asteroid.rotation}deg)`,
          }}
        />
      ))}

      <div className="text-center space-y-6 z-10">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-dancing">
            CodeArena
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
        </div>
        <p className="text-blue-300 font-stix text-lg">
          Where Code Meets the Cosmos
        </p>
        <div className="flex justify-center pt-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
