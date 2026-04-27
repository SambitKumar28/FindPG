import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

//  Security Middleware
app.use(helmet());

//  Rate Limiting (protect from abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP
});
app.use(limiter);

//  Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Cookies
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//  CORS (dynamic)
const allowedOrigins = [
  "http://localhost:5173",
  "https://findpg-woad.vercel.app/", // 🔥 add your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

//  Health Check Route (VERY IMPORTANT)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

//  Root Route
app.get("/", (req, res) => {
  res.send("FindPG API Running");
});

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

//  Not Found
app.use(notFound);

//  Error Handler
app.use(errorHandler);

export default app;