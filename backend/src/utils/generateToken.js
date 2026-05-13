import jwt from "jsonwebtoken";

/**
 * FIX #16 — Embed non-sensitive stable claims (id, role) in the access token.
 * Role-only middleware checks can use the JWT payload directly,
 * avoiding a DB round-trip on every request.
 *
 * The access token is short-lived (15 min), so stale role data risk is minimal.
 */

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
};

/**
 * FIX #6 — Embed tokenVersion in the refresh token.
 * Incrementing tokenVersion on the User document invalidates all
 * outstanding refresh tokens without needing a Redis blocklist.
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), tokenVersion: user.tokenVersion ?? 0 },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );
};