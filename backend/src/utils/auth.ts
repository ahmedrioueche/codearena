import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAuthTokens } from '../types/auth';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async comparePasswords(inputPassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, userPassword);
  }

  static generateTokens(userId: string): IAuthTokens {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
    } catch (error) {
      return null;
    }
  }
}
