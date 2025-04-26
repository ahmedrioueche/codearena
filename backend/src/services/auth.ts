import { ISignUpRequest, ISignInRequest, IAuthTokens } from '../types/auth';
import { AuthUtils } from '../utils/auth';
import { UserModel } from '../models/user';
import { IUser } from '../types/user';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async signUp(userData: ISignUpRequest): Promise<{ user: IUser; tokens: IAuthTokens }> {
    // 1. Check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // 2. Hash password
    const hashedPassword = await AuthUtils.hashPassword(userData.password);

    // 3. Create user
    const user = await UserModel.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });

    // 4. Generate tokens
    const tokens = AuthUtils.generateTokens(user._id.toString());

    return { user, tokens };
  }

  static async signIn(credentials: ISignInRequest): Promise<{ user: IUser; tokens: IAuthTokens }> {
    // 1. Find user by email
    const user = await UserModel.findOne({ email: credentials.email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Compare passwords
    const isMatch = await AuthUtils.comparePasswords(credentials.password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Generate tokens
    const tokens = AuthUtils.generateTokens(user._id.toString());

    return { user, tokens };
  }

  static async resetPassword(email: string, newPassword: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await AuthUtils.hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    return user;
  }
  static async refreshTokens(refreshToken: string): Promise<IAuthTokens> {
    try {
      // 1. Verify token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
      };

      // 2. Check if token exists in user's valid tokens
      const user = await UserModel.findOne({
        _id: decoded.userId,
        refreshTokens: refreshToken,
      });
      if (!user) throw new Error('Invalid refresh token');

      // 3. Generate new tokens (rotates refresh token)
      const tokens = await this.generateAndStoreTokens(user._id.toString());

      // 4. Remove old refresh token
      await UserModel.findByIdAndUpdate(user._id, {
        $pull: { refreshTokens: refreshToken },
      });

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private static async generateAndStoreTokens(userId: string): Promise<IAuthTokens> {
    // Generate tokens
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: '7d',
    });

    // Store the new refresh token
    await UserModel.findByIdAndUpdate(userId, {
      $push: { refreshTokens: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  static async logout(userId: string, refreshToken: string): Promise<void> {
    // Remove the specific refresh token
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: refreshToken },
    });
  }
}
