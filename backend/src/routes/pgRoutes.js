import express from "express";
import {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG,
  getMyPGs,
} from "../controllers/pgController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllPGs);
router.get("/my-pgs", protect, authorize("owner", "admin"), getMyPGs);
router.get("/:id", getPGById);

// Protected
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 5),
  createPG
);

router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 5),
  updatePG
);

router.delete("/:id", protect, authorize("owner", "admin"), deletePG);

export default router;