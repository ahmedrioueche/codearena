import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { validateRequest } from '../middlewares/validation';
import { signUpSchema, signInSchema, verifyResetPasswordSchema } from '../validations/auth';
import { sendOtpSchema, verifyOtpSchema } from '../validations/auth';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/signup', validateRequest(signUpSchema), AuthController.signUp);
router.post('/signin', validateRequest(signInSchema), AuthController.signIn);
router.post('/logout', AuthController.logout);
router.post('/send-otp', validateRequest(sendOtpSchema), AuthController.sendOtp as any);
router.post('/verify-otp', validateRequest(verifyOtpSchema), AuthController.verifyOtp as any);
router.post('/refresh', authMiddleware, AuthController.refreshToken as any);
router.post(
  '/reset-password',
  validateRequest(verifyResetPasswordSchema),
  AuthController.resetPassword as any,
);

export default router;
