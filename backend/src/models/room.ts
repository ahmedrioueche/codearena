import mongoose, { Schema, Types } from 'mongoose';
import { GameModeEnum, CategoryEnum } from '../types/game';
import { RoomSettings, IRoomDocument } from '../types/room';

const RoomSettingsSchema = new Schema<RoomSettings>({
  mode: {
    type: String,
    enum: Object.values(GameModeEnum),
    default: GameModeEnum.RANDOM,
    required: true,
  },
  category: {
    type: String,
    enum: Object.values(CategoryEnum),
    default: CategoryEnum.ANIMAL,
    required: true,
  },
  questionTime: {
    type: Number,
    min: 10,
    max: 120,
    default: 30,
    required: true,
  },
  RoundsPerMatch: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
    required: true,
  },
});

const MatchDataSchema = new Schema({
  questions: [
    {
      type: Schema.Types.Mixed,
      required: true,
    },
  ],
  askedUsers: [
    {
      type: Types.ObjectId,
      ref: 'User',
      required: false,
    },
  ],
});

const roomSchema = new Schema<IRoomDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    settings: {
      type: RoomSettingsSchema,
      required: true,
      default: () => ({}),
    },

    matchData: {
      type: MatchDataSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
roomSchema.index({ code: 1 });
roomSchema.index({ users: 1 });

export const RoomModel = mongoose.model<IRoomDocument>('Room', roomSchema);
