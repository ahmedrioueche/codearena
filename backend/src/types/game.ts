import { IUserDocument } from './user';

export const GameModeEnum = {
  RANDOM: 'random',
  RANDOM_NEW: 'random-new',
  FREE_FOR_ALL: 'free-for-all',
} as const;

export type GameMode = (typeof GameModeEnum)[keyof typeof GameModeEnum];

export const CategoryEnum = {
  ANIMAL: 'animal',
  COUNTRY: 'country',
  FOOD: 'food',
  CAPITAL: 'capital',
} as const;

export type Category = (typeof CategoryEnum)[keyof typeof CategoryEnum];
