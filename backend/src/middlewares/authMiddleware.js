import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

//  Protect Route (Auth Middleware)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  //  Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //  Fallback: Check Cookies (for refresh/session-based flow)
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  //  No token
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    //  Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Attach full user (without password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

//  Role-Based Authorization Middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};