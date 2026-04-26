import { z } from "zod";

// ================= REGISTER =================
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Invalid email"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),

    role: z.enum(["user", "owner"]).optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

// ================= LOGIN =================
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password is required"),
  }),
});