import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  fullName: string;
  isVerified: boolean;
  isAdmin: boolean;
  age: number;
  experienceLevel: ExperienceLevel;
  playStatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  refreshTokens: string[];
}
export interface IUserDocument extends IUser, Document {}

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
