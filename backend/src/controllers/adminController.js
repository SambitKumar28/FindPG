import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import PG from "../models/PG.js";
import Booking from "../models/Booking.js";

// ================= USERS =================
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select("-password").skip(skip).limit(Number(limit)),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
    data: users,
  });
});

// ================= PGs =================
export const getAllPGs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [pgs, total] = await Promise.all([
    PG.find()
      .populate("owner", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    PG.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
    data: pgs,
  });
});

// ================= BOOKINGS =================
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find()
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("pg", "title city locality rent")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
    data: bookings,
  });
});

// ================= DELETE USER (SAFE) =================
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Soft delete
  user.isDeleted = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User deactivated successfully",
  });
});

// ================= DELETE PG =================
export const deletePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  pg.isDeleted = true;
  await pg.save();

  res.status(200).json({
    success: true,
    message: "PG removed successfully",
  });
});

// ================= APPROVE / REJECT =================
export const approvePG = asyncHandler(async (req, res) => {
  const pg = await PG.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: "approved" },
    { new: true }
  );

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  res.status(200).json({
    success: true,
    message: "PG approved",
    pg,
  });
});

export const rejectPG = asyncHandler(async (req, res) => {
  const pg = await PG.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: "rejected" },
    { new: true }
  );

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  res.status(200).json({
    success: true,
    message: "PG rejected",
    pg,
  });
});

// ================= BLOCK USER =================
export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: true },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User blocked",
    user,
  });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User unblocked",
    user,
  });
});

// ================= DASHBOARD STATS (OPTIMIZED) =================
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalPGs,
    totalBookings,
    totalOwners,
    totalUsersRole,
    pendingPGs,
    approvedPGs,
    rejectedPGs,
  ] = await Promise.all([
    User.countDocuments(),
    PG.countDocuments(),
    Booking.countDocuments(),
    User.countDocuments({ role: "owner" }),
    User.countDocuments({ role: "user" }),
    PG.countDocuments({ approvalStatus: "pending" }),
    PG.countDocuments({ approvalStatus: "approved" }),
    PG.countDocuments({ approvalStatus: "rejected" }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalPGs,
      totalBookings,
      totalOwners,
      totalUsersRole,
      pendingPGs,
      approvedPGs,
      rejectedPGs,
    },
  });
});