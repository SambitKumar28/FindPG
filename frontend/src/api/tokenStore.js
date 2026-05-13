/**
 * FIX #5 — In-memory access token store.
 *
 * Access tokens are NOT stored in localStorage (XSS-readable).
 * They live here as a plain module variable for the lifetime of the page.
 * On a hard refresh, AuthContext calls /api/auth/refresh (using the
 * httpOnly refresh-token cookie) to silently restore the session.
 *
 * The axios interceptor reads getAccessToken() to attach the Authorization
 * header without needing React context inside the interceptor closure.
 */

let _token = null;

export const setAccessToken = (token) => {
  _token = token;
};

export const getAccessToken = () => _token;

export const clearAccessToken = () => {
  _token = null;
};
