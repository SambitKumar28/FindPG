import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import PG from '../models/PG.js';
import Booking from '../models/Booking.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get all PGs
// @route   GET /api/admin/pgs
// @access  Admin
export const getAllPGs = asyncHandler(async (req, res) => {
  const pgs = await PG.find()
    .populate('owner', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pgs.length,
    pgs,
  });
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('owner', 'name email')
    .populate('pg', 'title city locality rent')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Delete PG
// @route   DELETE /api/admin/pgs/:id
// @access  Admin
export const deletePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  await pg.deleteOne();

  res.status(200).json({
    success: true,
    message: 'PG deleted successfully',
  });
});

// @desc    Approve PG
// @route   PUT /api/admin/pgs/:id/approve
// @access  Admin
export const approvePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  pg.approvalStatus = 'approved';
  await pg.save();

  res.status(200).json({
    success: true,
    message: 'PG approved successfully',
    pg,
  });
});

// @desc    Reject PG
// @route   PUT /api/admin/pgs/:id/reject
// @access  Admin
export const rejectPG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  pg.approvalStatus = 'rejected';
  await pg.save();

  res.status(200).json({
    success: true,
    message: 'PG rejected successfully',
    pg,
  });
});

// @desc    Block user
// @route   PUT /api/admin/users/:id/block
// @access  Admin
export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isBlocked = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User blocked successfully',
    user,
  });
});

// @desc    Unblock user
// @route   PUT /api/admin/users/:id/unblock
// @access  Admin
export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isBlocked = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User unblocked successfully',
    user,
  });
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalPGs = await PG.countDocuments();
  const totalBookings = await Booking.countDocuments();

  const totalOwners = await User.countDocuments({ role: 'owner' });
  const totalStudents = await User.countDocuments({ role: 'student' });

  const pendingPGs = await PG.countDocuments({
    approvalStatus: 'pending',
  });

  const approvedPGs = await PG.countDocuments({
    approvalStatus: 'approved',
  });

  const rejectedPGs = await PG.countDocuments({
    approvalStatus: 'rejected',
  });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalPGs,
      totalBookings,
      totalOwners,
      totalStudents,
      pendingPGs,
      approvedPGs,
      rejectedPGs,
    },
  });
});