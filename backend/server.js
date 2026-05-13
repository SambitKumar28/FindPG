import "dotenv/config";
import { validateEnv } from "./src/config/validateEnv.js";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

// Crash immediately with a clear message if env is misconfigured
validateEnv();

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully`);
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
    // Force-kill if server hangs for more than 10 s
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Unhandled promise rejections — log and exit so the process manager restarts
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    server.close(() => process.exit(1));
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});