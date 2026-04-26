import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  toggleFavorite,
} from "../controllers/favoriteController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  User-only routes
router.get("/", protect, authorize("user"), getFavorites);

//  Toggle (better UX)
router.post("/toggle/:pgId", protect, authorize("user"), toggleFavorite);

// Optional explicit routes
router.post("/:pgId", protect, authorize("user"), addToFavorites);
router.delete("/:pgId", protect, authorize("user"), removeFromFavorites);

export default router;