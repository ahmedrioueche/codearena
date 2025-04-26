import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  static async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification OTP',
      text: `Your OTP is: ${otp}\nIt will expire in 5 minutes.`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      console.log('Error sending OTP: ', e);
    }
  }
}
