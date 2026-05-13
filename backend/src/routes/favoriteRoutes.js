import express from "express";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
} from "../controllers/favoriteController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("user"), getFavorites);
router.post("/:pgId", protect, authorize("user"), addToFavorites);
router.delete("/:pgId", protect, authorize("user"), removeFromFavorites);
router.patch("/:pgId/toggle", protect, authorize("user"), toggleFavorite);

export default router;