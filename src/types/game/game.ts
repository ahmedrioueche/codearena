export type GameMode = "solo" | "battle" | "collab";

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

export interface ProgrammingLanguage {
  id: string;
  name: string;
  icon: string;
}

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
  description: string;
  difficulty: DifficultyLevel;
  averageTime?: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  passed: boolean;
}

export interface TestResult {
  passed: boolean;
  executionTime: number;
  memory: string;
  testCases: TestCase[];
  message?: string;
}
