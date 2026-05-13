/**
 * Wraps an async route handler so that any thrown error is forwarded
 * to Express's next() error pipeline without needing try/catch in every handler.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;