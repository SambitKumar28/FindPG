import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import validate from "../middlewares/validateMiddleware.js";

const router = express.Router();

// Stricter rate limit for authentication endpoints (brute-force prevention)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 10 minutes.",
  },
});

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);
router.get("/refresh", refreshAccessToken);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getCurrentUser);

export default router;