import { Router } from 'express';
import { UserController } from '../controllers/user';
import { authMiddleware } from '../middlewares/auth';
import { validateRequest } from '../middlewares/validation';
import { updateUserSchema } from '../validations/user';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe as any);

router.patch(
  '/me',
  authMiddleware,
  validateRequest(updateUserSchema),
  UserController.updateMe as any,
);
export default router;
