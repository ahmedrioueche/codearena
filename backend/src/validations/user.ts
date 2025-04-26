// src/validations/user.validation.ts
import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30).optional(),
    fullName: z.string().min(2).max(100).optional(),
    age: z.preprocess((val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? val : parsed;
      }
      return val;
    }, z.number().int().min(1).max(120).optional()),
    experienceLevel: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  }),
});
