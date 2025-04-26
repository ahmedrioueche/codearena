import { z } from 'zod';

export const signUpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const signInSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const verifyResetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});
