import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validations/authValidation.js";
import validate from "../middlewares/validateMiddleware.js";

const router = express.Router();

//  Rate limit for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 20, // max 20 requests per IP
});

//  Register
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  registerUser
);

//  Login
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  loginUser
);

//  Refresh Token (important for SaaS)
router.post("/refresh-token", refreshToken);

//  Logout
router.post("/logout", protect, logoutUser);

//  Current User
router.get("/me", protect, getCurrentUser);

export default router;