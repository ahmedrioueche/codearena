import { Types } from 'mongoose';
import { GameSettings } from './game';

export interface IRoomDocument {
  save(): unknown;
  _id: string;
  code: string;
  users: Types.ObjectId[];
  settings: GameSettings;
  adminId: string;
}
