import { Flame, Shield, Trophy } from "lucide-react";
import {
  DifficultyLevelInterface,
  ProgrammingLanguageI,
  SkillLevel,
  TimeLimit,
  Topic,
} from "../types/game/game";

export const languages: ProgrammingLanguageI[] = [
  { id: "typescript", name: "TypeScript", icon: "🔷" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "c", name: "C", icon: "📟" },
  { id: "cpp", name: "C++", icon: "⚙️" },
  { id: "go", name: "Go", icon: "🐹" },
  { id: "javascript", name: "JavaScript", icon: "⚡" },
  { id: "csharp", name: "C#", icon: "🎮" },
  { id: "ruby", name: "Ruby", icon: "💎" },
  { id: "swift", name: "Swift", icon: "🍏" },
  { id: "kotlin", name: "Kotlin", icon: "📱" },
  { id: "rust", name: "Rust", icon: "🦀" },
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "r", name: "R", icon: "📊" },
  { id: "elixir", name: "Elixir", icon: "💧" },
];

export const topics: Topic[] = [
  { id: "algorithms", name: "Algorithms" },
  { id: "data-structures", name: "Data Structures" },
  { id: "problem-solving", name: "Problem Solving" },
  { id: "debugging", name: "Debugging" },
  { id: "optimization", name: "Optimization" },
  { id: "graph-theory", name: "Graph Theory" },
  {
    id: "design-patterns",
    name: "Design Patterns",
  },
  {
    id: "testing",
    name: "Testing",
  },
  {
    id: "language-learning",
    name: "Language Learning",
  },
  { id: "functional-programming", name: "Functional Programming" },
  { id: "dynamic-programming", name: "Dynamic Programming" },
  { id: "recursion", name: "Recursion" },
  { id: "database-design", name: "Database Design" },
  { id: "api-design", name: "API Design" },
  { id: "multithreading", name: "Multithreading" },
  { id: "security", name: "Cybersecurity" },
  { id: "encryption", name: "Encryption" },
  { id: "networking", name: "Networking" },
  { id: "ai-ml", name: "Machine Learning" },
  { id: "computer-visiton", name: "Computer vision" },
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

export const SCORE_VALUES = {
  defaultPoints: 10, // Default points if problemPoints is undefined
  correctnessWeight: 0.5, // Correctness contributes 50% of the score
  efficiencyWeights: {
    Excellent: 0.2,
    Good: 0.15,
    Average: 0.1,
    Poor: 0.05,
  },
  penalties: {
    hint: 0.1, // 10% of points per hint
    nextLineHelp: 0.2, // 15% of points per next-line help
    syntaxMistake: 0.2, // 5% of points per syntax mistake
    logicMistake: 0.25, // 10% of points per logic mistake
    timePerSecond: 0.01, // 1% of points per second after threshold
  },
  codeQualityWeights: {
    Excellent: 0.15,
    Good: 0.1,
    Average: 0.05,
    Poor: 0,
  },
  timeThreshold: 60, // Time threshold in seconds
  bonus: {
    improvements: 0.05, // 5% of points for having improvement suggestions
  },
};

export const ERRORS = {
  noSolution: "No Solution",
  noAnswer: "No Answer",
  NoNextLine: "No Next Line",
};
