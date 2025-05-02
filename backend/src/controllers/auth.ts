import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { ISignUpRequest, ISignInRequest } from '../types/auth';
import { OtpService } from '../services/otp';
import { ISendOtpRequest, IVerifyOtpRequest } from '../types/auth';
import { UserModel } from '../models/user';

export class AuthController {
  static async signUp(req: Request, res: Response) {
    try {
      const userData: ISignUpRequest = req.body;
      const { user, tokens } = await AuthService.signUp(userData);

      // Set Access-Control-Allow-Credentials header
      res.header('Access-Control-Allow-Credentials', 'true');

      // Set secure HTTP-only cookies
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.status(201).json({
        user: { email: user.email, id: user._id },
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async signIn(req: Request, res: Response) {
    try {
      const credentials: ISignInRequest = req.body;
      const { user, tokens } = await AuthService.signIn(credentials);

      // Set Access-Control-Allow-Credentials header
      res.header('Access-Control-Allow-Credentials', 'true');

      // Set secure HTTP-only cookies
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.status(200).json({
        user: { email: user.email, id: user._id },
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      // Set Access-Control-Allow-Credentials header
      res.header('Access-Control-Allow-Credentials', 'true');

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Logout failed', error: error.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(' ')[1];

      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }
      // Verify and get new tokens
      const tokens = await AuthService.refreshTokens(refreshToken);

      // Set Access-Control-Allow-Credentials header
      res.header('Access-Control-Allow-Credentials', 'true');

      // Set new secure HTTP-only cookies
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.status(200).json({
        message: 'Tokens refreshed successfully',
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      // Clear invalid tokens
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      res.status(401).json({
        message: 'Invalid refresh token',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // Rest of your methods remain unchanged
  static sendOtp = async (req: Request<{}, {}, ISendOtpRequest>, res: Response) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'Email not registered' });
      }

      await OtpService.sendOtp(email);
      return res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('OTP Controller Error:', error);
      return res.status(500).json({
        message: 'Failed to send OTP',
        error: process.env.NODE_ENV === 'development' ? error : '',
      });
    }
  };

  static verifyOtp = async (req: Request<{}, {}, IVerifyOtpRequest>, res: Response) => {
    try {
      const { email, otp } = req.body;
      const isValid = await OtpService.verifyOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Mark user as verified or perform other actions
      await UserModel.updateOne({ email }, { $set: { isVerified: true } });

      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify OTP' });
    }
  };

  static resetPassword = async (
    req: Request<{}, {}, { email: string; newPassword: string }>,
    res: Response,
  ) => {
    try {
      const { email, newPassword } = req.body;

      // 1. Find the user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 2. Update the password (AuthService should handle hashing)
      const updatedUser = await AuthService.resetPassword(email, newPassword);

      // 3. Clear any existing tokens (optional security measure)
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      // 4. Return success response
      res.status(200).json({
        message: 'Password reset successfully',
        user: { email: updatedUser.email, id: updatedUser._id },
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      res.status(500).json({
        message: 'Failed to reset password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
}
