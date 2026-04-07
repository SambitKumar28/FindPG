import express from 'express';
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
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/pgs', protect, adminOnly, getAllPGs);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.get('/stats', protect, adminOnly, getDashboardStats);

router.delete('/users/:id', protect, adminOnly, deleteUser);
router.delete('/pgs/:id', protect, adminOnly, deletePG);

router.put('/pgs/:id/approve', protect, adminOnly, approvePG);
router.put('/pgs/:id/reject', protect, adminOnly, rejectPG);

router.put('/users/:id/block', protect, adminOnly, blockUser);
router.put('/users/:id/unblock', protect, adminOnly, unblockUser);

export default router;