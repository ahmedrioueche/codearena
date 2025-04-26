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
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
