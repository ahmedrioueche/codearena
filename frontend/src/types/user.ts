type Rank = "noob" | "not_bad" | "good" | "pro" | "legend";
export type ExperienceLevel = "beginner" | "intermediate" | "expert";

export interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
  score: number;
  rank: Rank;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  password?: string;
  fullName?: string;
  age?: string;
  experienceLevel?: ExperienceLevel;
}
