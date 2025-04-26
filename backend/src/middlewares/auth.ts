import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { AuthenticatedRequest } from '../types/express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = AuthUtils.verifyAccessToken(token);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Type assertion after validation
    (req as AuthenticatedRequest).user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
