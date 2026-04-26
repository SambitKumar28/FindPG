import bcrypt from "bcryptjs";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";

//  Generate Tokens
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

//  Send Refresh Token in Cookie
const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

// ================= REGISTER =================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role  } = req.body;


if (password !== confirmPassword) {
  res.status(400);
  throw new Error("Passwords do not match");
}


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ================= LOGIN =================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  sendRefreshToken(res, refreshToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ================= REFRESH TOKEN =================
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error("No refresh token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken(decoded.id);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }
});

// ================= CURRENT USER =================
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});