type Rank = "noob" | "not_bad" | "good" | "pro" | "legend";
export type ExperienceLevel = "beginner" | "intermediate" | "expert";

export interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
  isVerified?: boolean;
  score: number;
  rank: Rank;
  accuracy: number;
  wins: number;
  playStatus?: "ready" | "not-ready";
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  isVerified?: boolean;
  password?: string;
  fullName?: string;
  age?: string;
  experienceLevel?: ExperienceLevel;
}
