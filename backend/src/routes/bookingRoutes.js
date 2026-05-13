import express from "express";
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("user"), createBooking);
router.get("/my", protect, authorize("user"), getMyBookings);
router.get("/owner", protect, authorize("owner", "admin"), getOwnerBookings);
router.put("/:id/approve", protect, authorize("owner", "admin"), approveBooking);
router.put("/:id/reject", protect, authorize("owner", "admin"), rejectBooking);
router.put("/:id/cancel", protect, authorize("user", "admin"), cancelBooking);

export default router;