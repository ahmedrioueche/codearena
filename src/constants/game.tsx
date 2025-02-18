import { Flame, Shield, Trophy } from "lucide-react";
import {
  DifficultyLevelInterface,
  ProgrammingLanguage,
  SkillLevel,
  TimeLimit,
  Topic,
} from "../types/game/game";

export const languages: ProgrammingLanguage[] = [
  { id: "javascript", name: "JavaScript", icon: "⚡" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "cpp", name: "C++", icon: "⚙️" },
  { id: "ruby", name: "Ruby", icon: "💎" },
];

export const topics: Topic[] = [
  { id: "algorithms", name: "Algorithms" },
  { id: "data-structures", name: "Data Structures" },
  { id: "problem-solving", name: "Problem Solving" },
  { id: "debugging", name: "Debugging" },
  { id: "optimization", name: "Optimization" },
];

export const difficultyLevels: DifficultyLevelInterface[] = [
  {
    id: "easy",
    name: "Novice",
    description: "Perfect for beginners",
    icon: <Shield className="w-5 h-5 text-green-500" />,
  },
  {
    id: "medium",
    name: "Adept",
    description: "Balanced challenge",
    icon: <Flame className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: "hard",
    name: "Master",
    description: "True test of skill",
    icon: <Trophy className="w-5 h-5 text-red-500" />,
  },
];

export const skillLevels: SkillLevel[] = [
  {
    id: "0",
    name: "beginner",
  },
  {
    id: "1",
    name: "junior",
  },
  {
    id: "2",
    name: "intermediate",
  },
  {
    id: "3",
    name: "senior",
  },
];

export const timeLimits: TimeLimit[] = [
  { id: "15", duration: 15, label: "15 minutes" },
  { id: "30", duration: 30, label: "30 minutes" },
  { id: "45", duration: 45, label: "45 minutes" },
  { id: "60", duration: 60, label: "60 minutes" },
];
