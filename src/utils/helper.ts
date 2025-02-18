import { DifficultyLevel } from "../types/game/game";
import { Language } from "../types/general";

export const getLanguages = (dict: Record<string, any>): Language[] => {
  return Object.keys(dict) as Language[];
};

export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case "easy":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
