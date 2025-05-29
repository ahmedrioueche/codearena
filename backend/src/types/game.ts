export const GameModeEnum = {
  BATTLE: 'battle',
  COLLAB: 'collab',
} as const;

export type GameMode = (typeof GameModeEnum)[keyof typeof GameModeEnum];

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface GameSettings {
  [x: string]: any;
  gameMode: GameMode;
  language: string;
  maxPlayers: number;
  difficultyLevel: DifficultyLevel;
  teamSize: number;
  timeLimit: number;
  topics: string[];
}
