import express from "express";
import {
  getAllUsers,
  getAllPGs,
  getAllBookings,
  deleteUser,
  deletePG,
  approvePG,
  rejectPG,
  blockUser,
  unblockUser,
  getDashboardStats,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// FIX #18 — All admin routes use protect + authorize("admin").
// adminMiddleware.js and roleMiddleware.js are deleted; this single pattern
// replaces all three redundant middlewares.
const adminOnly = [protect, authorize("admin")];

router.get("/stats", ...adminOnly, getDashboardStats);

router.get("/users", ...adminOnly, getAllUsers);
router.delete("/users/:id", ...adminOnly, deleteUser);
router.put("/users/:id/block", ...adminOnly, blockUser);
router.put("/users/:id/unblock", ...adminOnly, unblockUser);

router.get("/pgs", ...adminOnly, getAllPGs);
router.delete("/pgs/:id", ...adminOnly, deletePG);
router.put("/pgs/:id/approve", ...adminOnly, approvePG);
router.put("/pgs/:id/reject", ...adminOnly, rejectPG);

router.get("/bookings", ...adminOnly, getAllBookings);

export default router;