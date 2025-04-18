import { z } from 'zod';

// Register DTO
export const registerUserDto = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10).max(15)
});

// Login DTO
export const loginUserDto = z.object({
  email: z.string().email(),
  password: z.string()
});

// Update Profile DTO
export const updateProfileDto = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional()
});

// Change Password DTO
export const changePasswordDto = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6)
}); 