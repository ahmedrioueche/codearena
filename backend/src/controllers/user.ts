import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { UserModel } from '../models/user';

export class UserController {
  static getMe = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserModel.findById(req.user.userId).select(
        'username email fullName age experienceLevel',
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };

  static updateMe = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { username, fullName, age, experienceLevel } = req.body;

      console.log({ username, fullName, age, experienceLevel });
      // Validate experienceLevel if provided
      if (experienceLevel && !['beginner', 'intermediate', 'expert'].includes(experienceLevel)) {
        return res.status(400).json({ message: 'Invalid experience level' });
      }

      // Validate age if provided
      if (age) {
        // Convert string age to number if needed
        const ageNumber = typeof age === 'string' ? parseInt(age, 10) : age;

        if (isNaN(ageNumber)) {
          return res.status(400).json({ message: 'Age must be a valid number' });
        }

        if (ageNumber < 0 || ageNumber > 120) {
          return res.status(400).json({ message: 'Age must be between 0 and 120' });
        }
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user.userId,
        {
          username,
          fullName,
          age,
          experienceLevel,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true },
      ).select('username email fullName age experienceLevel createdAt updatedAt');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(updatedUser);
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({
        message: 'Failed to update user',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  };
}
