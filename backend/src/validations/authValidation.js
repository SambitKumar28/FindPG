import { z } from "zod";

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

      email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email address"),

      phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone must be a 10-digit number")
        .optional()
        .or(z.literal("")),

      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(72, "Password cannot exceed 72 characters"),

      confirmPassword: z.string({ required_error: "Please confirm your password" }),

      // FIX: 'admin' cannot be self-assigned during registration
      role: z.enum(["user", "owner"], {
        errorMap: () => ({ message: 'Role must be "user" or "owner"' }),
      }).optional().default("user"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email address"),

    // FIX #12 — was "Password is required" for a length check, which is misleading
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});