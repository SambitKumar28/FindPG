/**
 * Validates that all required environment variables are present and non-empty.
 * Throws on startup if anything is missing so problems are caught immediately
 * instead of at runtime deep inside a request handler.
 */

const REQUIRED = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Copy backend/.env.example to backend/.env and fill in the values."
    );
  }

  // Warn about weak secrets in production
  if (process.env.NODE_ENV === "production") {
    const weakSecrets = ["JWT_SECRET", "JWT_REFRESH_SECRET"].filter(
      (key) => process.env[key].length < 32
    );
    if (weakSecrets.length > 0) {
      console.warn(
        `⚠️  Weak secrets detected for: ${weakSecrets.join(", ")}. ` +
          "Use at least 64 random hex characters."
      );
    }
  }
};
