import { Types } from 'mongoose';
import { Category, GameMode } from './game';
import { IUserDocument } from './user';
import { Question } from './question';

export interface IRoomDocument {
  save(): unknown;
  _id: string;
  code: string;
  users: Types.ObjectId[];
  settings: RoomSettings;
  matchData?: {
    questions: Question[];
    askedUsers: Types.ObjectId[];
  };
}

export interface RoomSettings {
  mode: GameMode;
  category: Category;
  questionTime: number;
  RoundsPerMatch: number;
}
