import mongoose, { Schema, Types, Document } from 'mongoose';
import { IRoomDocument } from '../types/room';
import { GameModeEnum, GameSettings } from '../types/game';

const GameSettingsSchema = new Schema<GameSettings>({
  gameMode: {
    type: String,
    enum: Object.values(GameModeEnum),
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  maxPlayers: {
    type: Number,
    required: false,
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'] as const,
    required: true,
  },
  teamSize: {
    type: Number,
    required: false,
  },
  timeLimit: {
    type: Number,
    required: false,
  },
  topics: {
    type: [String],
    required: false,
    default: [],
  },
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
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    settings: {
      type: GameSettingsSchema,
      required: true,
    },
    adminId: {
      type: String,
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
