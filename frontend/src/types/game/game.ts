import { languages } from "../../constants/game";

export type GameMode = "solo" | "battle" | "collab" | "save-the-code";

export type ConfigMode = "search" | "teamup" | "create" | "join";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface GameSettings {
  language: string;
  maxPlayers: string;
  difficultyLevel: DifficultyLevel;
  teamSize: string;
  timeLimit: string;
  topics: string[];
}

export const CONFIG_MODES = {
  SEARCH: "search",
  CREATE: "create",
  JOIN: "join",
} as const;

export interface Player {
  id: number;
  name: string;
  rating: number;
  skillLevel: "beginner" | "junior" | "intermediate" | "senior";
}

export interface Topic {
  id: string;
  name: string;
}

export interface ProgrammingLanguageI {
  id: string;
  name: string;
  icon: string;
}

export type ProgrammingLanguageT = (typeof languages)[number]["id"];

export interface MatchConfigInterface {
  language: string;
  topics: string[];
  difficultyLevel: DifficultyLevel;
  timeLimit: string;
}

export interface DifficultyLevelInterface {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface SkillLevel {
  id: string;
  name: string;
}

export interface TimeLimit {
  id: string;
  duration: number;
  label: string;
}

export interface Problem {
  id: string;
  title: string;
  topic: string;
  language?: string;
  description: string;
  difficulty: DifficultyLevel;
  averageTime?: number;
  points?: number;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  testFunction?: string;
  validationResult?: boolean;
  validationAccuracy?: number;
  expanded?: boolean;
}

export interface TestResult {
  id: string;
  passed: boolean;
  accuracy?: number;
  errors?: string[];
}

export interface SolutionValidationResult {
  isValid: boolean; // Whether the solution is correct
  correctnessPercentage: number; // Percentage of correctness
  timeComplexity?: string; //Time complexity with explanation
  spaceComplexity?: string; //Space complexity with explanation
  syntaxMistakesCount: number; //syntax mistakes
  logicMistakesCount: number; //logic mistakes
  codeQuality: "Excellent" | "Good" | "Average" | "Poor"; //code quality: readability and good practises
  efficiencyRating: "Excellent" | "Good" | "Average" | "Poor"; // Performance rating
  bottleneckAnalysis?: string; // Explanation of performance issues
  useSolutionCorrection?: string; //The user's solution with comments highlighting mistakes and bad approaches...
  alternativeApproaches?: string[]; // Better solution suggestions
  correctSolution?: string; // The correct solution (if incorrect)
  comments: string; // Remarks about the solution
  improvements?: string[]; // Suggestions to improve the solution
}
