import mongoose, { Document, Schema, Types } from 'mongoose';
import { GameSettings, GameModeEnum } from '../types/game';
import { IUserDocument } from '../types/user';

export interface ISearch extends Document {
  user: IUserDocument;
  settings: GameSettings;
  createdAt: Date;
  expiresAt: Date;
  matched: boolean;
}

const searchSchema = new Schema<ISearch>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: {
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
        enum: ['easy', 'medium', 'hard'],
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
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 min TTL
    },
    matched: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Added timestamps for createdAt and updatedAt
  },
);

// Indexes for faster searching
searchSchema.index({
  'settings.gameMode': 1,
  'settings.language': 1,
  'settings.difficultyLevel': 1,
  expiresAt: 1,
  matched: 1,
});

// TTL index for automatic cleanup
searchSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SearchModel = mongoose.model<ISearch>('Search', searchSchema);
