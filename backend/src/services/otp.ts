import { OtpModel } from "../models/otp";
import crypto from "crypto";
import { EmailService } from "./email";

export class OtpService {
  static async sendOtp(email: string): Promise<void> {
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Save or update OTP
    await OtpModel.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true },
    );

    // Send email
    await EmailService.sendOtpEmail(email, otp);
  }

  static async verifyOtp(email: string, otp: string): Promise<boolean> {
    const record = await OtpModel.findOne({ email });

    if (!record || record.otp !== otp) {
      return false;
    }

    // Check if OTP expired
    if (record.expiresAt < new Date()) {
      await OtpModel.deleteOne({ email });
      return false;
    }

    // Delete OTP after successful verification
    await OtpModel.deleteOne({ email });
    return true;
  }
}
