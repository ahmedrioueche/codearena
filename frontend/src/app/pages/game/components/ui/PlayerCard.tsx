import React from "react";
import { Rank } from "../../../../../types/user";
interface PlayerCardProps {
  name: string;
  avatar: string;
  rank: Rank;
  score: number;
  accuracy: number;
  wins: number;
  onClick: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  avatar,
  rank,
  onClick,
}) => {
  const getSkillLevelColor = (level: Rank) => {
    switch (level) {
      case "noob":
        return "text-green-500";
      case "not_bad":
        return "text-blue-500";
      case "good":
        return "text-purple-500";
      case "pro":
        return "text-orange-500";
      case "legend":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      onClick={onClick}
      className="w-32 h-34 flex flex-col cursor-pointer hover:scale-105 transition duration-300 items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg "
    >
      {/* Avatar Section */}
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-light-primary dark:ring-dark-primary"
        />
      </div>

      {/* Info Section */}
      <div className="mt-2 flex flex-col items-center">
        <span className="font-semibold text-sm text-center truncate max-w-full text-light-foreground dark:text-dark-foreground">
          {name}
        </span>
        <span className={`text-xs mt-1 ${getSkillLevelColor(rank)}`}>
          {capitalizeFirstLetter(rank.replace("_", " "))}
        </span>
      </div>
    </div>
  );
};

export default PlayerCard;
