import mongoose, { Document, Schema } from "mongoose";
import { IOtp } from "../types/auth";

export interface IOtpDocument extends IOtp, Document {}

const otpSchema = new Schema<IOtpDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "5m" }, // Auto-delete after 5 minutes
  },
});

export const OtpModel = mongoose.model<IOtpDocument>("Otp", otpSchema);
