import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAuthTokens } from '../types/auth';
import { UserModel } from '../models/user';

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePasswords(inputPassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, userPassword);
  }

  static async generateAndStoreTokens(userId: string): Promise<IAuthTokens> {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET not configured');
    }
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '15m',
    });
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET not configured');
    }
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });

    // Properly store the refresh token
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          refreshTokens: {
            $each: [refreshToken],
            $position: 0,
            $slice: 5, // Keep only last 5 refresh tokens
          },
        },
      },
      { new: true },
    );

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): { userId: string } | null {
    try {
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET not configured');
      }
      return jwt.verify(token.trim(), process.env.ACCESS_TOKEN_SECRET, {
        algorithms: ['HS256'],
      }) as { userId: string };
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET not configured');
      }
      return jwt.verify(token.trim(), process.env.REFRESH_TOKEN_SECRET, {
        algorithms: ['HS256'],
      }) as { userId: string };
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }
}
