import { z } from 'zod';

const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

export const adminFormSchema = z
  .object({
    firstName: z.string().optional().default(''),
    lastName: z.string().optional().default(''),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    role: z.string().optional().default('Admin'),
    password: z
      .string()
      .min(14, 'Password must be at least 14 characters')
      .regex(
        hasUpperCase,
        'Password must contain at least one uppercase letter'
      )
      .regex(
        hasLowerCase,
        'Password must contain at least one lowercase letter'
      )
      .regex(hasNumber, 'Password must contain at least one number')
      .regex(
        hasSpecialChar,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AdminFormData = z.infer<typeof adminFormSchema>;
