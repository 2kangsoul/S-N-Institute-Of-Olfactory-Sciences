// src/Features/Auth/auth.validation.ts
import { z } from "zod";

export const authLoginValidation = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const authRegisterValidation = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(25, "Username must be at most 25 characters"),
  fullName: z
    .string()
    .min(5, "Full name must be at least 5 characters")
    .max(50, "Full name must be at most 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
  contact: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be at most 20 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type AuthLoginType = z.infer<typeof authLoginValidation>;
export type AuthRegisterType = z.infer<typeof authRegisterValidation>;
