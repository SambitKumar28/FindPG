import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

/**
 * protect — Verifies the access token, loads the full user from DB,
 * and checks isBlocked. Attaches req.user for downstream handlers.
 *
 * FIX #2  — Rejects blocked users.
 * FIX #16 — DB call kept for security (isBlocked must be checked server-side),
 *            but uses .lean() for a lighter result and selects only needed fields.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Prefer Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Fallback: access token cookie (set in some flows)
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — token is invalid or expired");
  }

  // Load minimal user fields; exclude password and tokenVersion
  const user = await User.findById(decoded.id)
    .select("-password -tokenVersion")
    .lean();

  if (!user) {
    res.status(401);
    throw new Error("Not authorized — user no longer exists");
  }

  // FIX #2 — Blocked users are rejected regardless of a valid token
  if (user.isBlocked) {
    res.status(403);
    throw new Error("Your account has been suspended. Please contact support.");
  }

  if (user.isDeleted) {
    res.status(403);
    throw new Error("This account has been deactivated.");
  }

  req.user = user;
  next();
});

/**
 * authorize(...roles) — Role gate that reads from the already-loaded req.user.
 * Must always be chained after protect().
 *
 * FIX #7 — Guards against req.user being undefined.
 * FIX #18 — Single authorisation middleware; roleMiddleware.js and
 *            adminMiddleware.js are deleted in favour of this one.
 *
 * Usage:
 *   router.get('/admin/users', protect, authorize('admin'), getAllUsers);
 *   router.post('/pgs', protect, authorize('owner', 'admin'), createPG);
 */
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
        message: `Access denied — required role(s): ${roles.join(", ")}`,
      });
    }

    next();
  };
};