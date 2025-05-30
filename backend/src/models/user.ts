import mongoose, { Schema } from 'mongoose';
import { IUserDocument } from '../types/user';

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: true,
    },
    fullName: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: true,
    },
    isVerified: {
      type: Boolean,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
    age: {
      type: Number,
      required: false,
      unique: false,
    },
    experienceLevel: {
      type: String,
      required: false,
      unique: false,
    },
    playStatus: {
      type: Boolean,
      required: false,
    },
    refreshTokens: {
      type: [String],
      select: false,
      index: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
