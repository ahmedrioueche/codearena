import { CookieOptions, Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { ISignUpRequest, ISignInRequest, ISendOtpRequest, IVerifyOtpRequest } from '../types/auth';
import { OtpService } from '../services/otp';
import { UserModel } from '../models/user';

export class AuthController {
  private static readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.up.railway.app' : undefined,
    path: '/',
  };

  private static setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const accessTokenOptions: CookieOptions = {
      ...AuthController.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    };

    const refreshTokenOptions: CookieOptions = {
      ...AuthController.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('accessToken', tokens.accessToken, accessTokenOptions);
    res.cookie('refreshToken', tokens.refreshToken, refreshTokenOptions);
  }

  private static clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', AuthController.cookieOptions);
    res.clearCookie('refreshToken', AuthController.cookieOptions);
  }

  static async signUp(req: Request, res: Response) {
    try {
      const { user, tokens } = await AuthService.signUp(req.body);
      AuthController.setAuthCookies(res, tokens);

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
      const { user, tokens } = await AuthService.signIn(req.body);
      AuthController.setAuthCookies(res, tokens);

      res.status(200).json({
        user: { email: user.email, id: user._id },
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async logout(_req: Request, res: Response) {
    try {
      AuthController.clearAuthCookies(res);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Logout failed', error: error.message });
    }
  }

  static async sendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'Email not registered' });
      }

      await OtpService.sendOtp(email);
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('OTP Controller Error:', error);
      res.status(500).json({
        message: 'Failed to send OTP',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const isValid = await OtpService.verifyOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      await UserModel.updateOne({ email }, { $set: { isVerified: true } });
      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify OTP' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.headers?.authorization?.split(' ')[1];
      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }

      const tokens = await AuthService.refreshTokens(refreshToken);
      AuthController.setAuthCookies(res, tokens);

      res.status(200).json({
        message: 'Tokens refreshed successfully',
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      AuthController.clearAuthCookies(res);
      res.status(401).json({
        message: 'Invalid refresh token',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await AuthService.resetPassword(email, newPassword);
      AuthController.clearAuthCookies(res);

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
  }
}
