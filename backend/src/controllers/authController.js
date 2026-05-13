import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * FIX #6 — Consistent cookie options for both setting and clearing.
 * Reuse the same options so the browser always recognises the cookie.
 */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, REFRESH_COOKIE_OPTIONS);
};

const clearRefreshToken = (res) => {
  res.cookie("refreshToken", "", {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("An account with that email already exists");
  }

  // FIX: role is validated by Zod to only be 'user' | 'owner' — never 'admin'
  const user = await User.create({
    name,
    email,
    password,
    phone: phone || "",
    role: role || "user",
  });

  // Issue tokens immediately so the client doesn't need a second login request
  // FIX #20 — Eliminates the double API call in AuthContext
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  sendRefreshToken(res, refreshToken);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    accessToken,
    user: user.toPublic(),
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Include tokenVersion so we can embed it in the refresh token
  const user = await User.findOne({ email }).select("+password +tokenVersion");

  // FIX: use a single generic message to prevent user enumeration
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // FIX #2 — Reject blocked users before issuing any tokens
  if (user.isBlocked) {
    res.status(403);
    throw new Error("Your account has been suspended. Please contact support.");
  }

  if (user.isDeleted) {
    res.status(403);
    throw new Error("This account has been deactivated.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  sendRefreshToken(res, refreshToken);

  res.status(200).json({
    success: true,
    accessToken,
    user: user.toPublic(),
  });
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token — please log in again");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }

  // FIX #6 — Verify token version matches the DB.
  // If the user has logged out (or been blocked), tokenVersion is incremented
  // and this check rejects all previously issued refresh tokens.
  const user = await User.findById(decoded.id).select("+tokenVersion");

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (user.isBlocked || user.isDeleted) {
    clearRefreshToken(res);
    res.status(403);
    throw new Error("Account is no longer active");
  }

  if (user.tokenVersion !== decoded.tokenVersion) {
    clearRefreshToken(res);
    res.status(401);
    throw new Error("Session expired — please log in again");
  }

  // Rotate: issue a fresh access token
  const newAccessToken = generateAccessToken(user);

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
    user: user.toPublic(),
  });
});

// ─── Current User ─────────────────────────────────────────────────────────────

export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is already loaded by protect middleware
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logoutUser = asyncHandler(async (req, res) => {
  // FIX #6 — Increment tokenVersion to invalidate all outstanding refresh tokens
  await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });

  // FIX #6 — Clear cookie with the same attributes used to set it
  clearRefreshToken(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});