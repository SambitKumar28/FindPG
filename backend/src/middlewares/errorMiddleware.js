/**
 * notFound — catches any request that didn't match a route.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler — global error handler.
 * Normalises Mongoose, Multer, JWT, and application errors into a
 * consistent JSON shape. Never leaks stack traces in production.
 */
export const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal server error";

  // Mongoose: bad ObjectId  →  404
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found — invalid ID format";
  }

  // Mongoose: unique constraint  →  409
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with that ${field} already exists`;
  }

  // Mongoose: validation errors  →  422
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors  →  401
  if (["JsonWebTokenError", "TokenExpiredError"].includes(err.name)) {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  // Multer errors  →  400
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") message = "File is too large (max 5 MB)";
    else if (err.code === "LIMIT_FILE_COUNT")
      message = "Too many files (max 5 images)";
    else message = err.message;
  }

  const isDev = process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
};