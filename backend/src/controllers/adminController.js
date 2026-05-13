import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import PG from "../models/PG.js";
import Booking from "../models/Booking.js";

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ─── USERS ────────────────────────────────────────────────────────────────────

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [users, total] = await Promise.all([
    User.find()
      .select("-password -tokenVersion")
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    pagination: { total, page, pages: Math.ceil(total / limit) },
    data: users,
  });
});

// ─── PGs ──────────────────────────────────────────────────────────────────────

export const getAllPGs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { approvalStatus } = req.query;

  const filter = {};
  if (approvalStatus) filter.approvalStatus = approvalStatus;

  const [pgs, total] = await Promise.all([
    PG.find(filter)
      .populate("owner", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PG.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    pagination: { total, page, pages: Math.ceil(total / limit) },
    data: pgs,
  });
});

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export const getAllBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [bookings, total] = await Promise.all([
    Booking.find()
      .populate("user", "name email")
      .populate("owner", "name email")
      .populate("pg", "title city locality rent")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    pagination: { total, page, pages: Math.ceil(total / limit) },
    data: bookings,
  });
});

// ─── SOFT DELETE USER ─────────────────────────────────────────────────────────

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(403);
    throw new Error("Admin accounts cannot be deactivated this way");
  }

  user.isDeleted = true;
  // Also increment tokenVersion to immediately revoke all sessions
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "User deactivated and sessions revoked",
  });
});

// ─── SOFT DELETE PG ───────────────────────────────────────────────────────────

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
    message: "PG removed from the platform",
  });
});

// ─── APPROVE / REJECT PG ──────────────────────────────────────────────────────

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

  res.status(200).json({ success: true, message: "PG approved", pg });
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

  res.status(200).json({ success: true, message: "PG rejected", pg });
});

// ─── BLOCK / UNBLOCK USER ─────────────────────────────────────────────────────

export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+tokenVersion");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(403);
    throw new Error("Admin accounts cannot be blocked");
  }

  // Increment tokenVersion to immediately revoke all active sessions
  user.isBlocked = true;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "User blocked and all sessions revoked",
  });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked: false },
    { new: true, select: "-password -tokenVersion" }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, message: "User unblocked", user });
});

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

/**
 * FIX #15 — Replaced 8 separate countDocuments() calls with 3 aggregation
 * pipelines using $facet, reducing total DB round-trips from 8 → 3.
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [userStats, pgStats, [bookingStats]] = await Promise.all([
    // Counts by role (and blocked/deleted totals) in one pass
    User.aggregate([
      {
        $facet: {
          byRole: [{ $group: { _id: "$role", count: { $sum: 1 } } }],
          total: [{ $count: "n" }],
          blocked: [{ $match: { isBlocked: true } }, { $count: "n" }],
          deleted: [{ $match: { isDeleted: true } }, { $count: "n" }],
        },
      },
    ]),

    // PG counts by approvalStatus in one pass
    PG.aggregate([
      {
        $facet: {
          byStatus: [{ $group: { _id: "$approvalStatus", count: { $sum: 1 } } }],
          total: [{ $count: "n" }],
        },
      },
    ]),

    // Total bookings + by status
    Booking.aggregate([
      {
        $facet: {
          total: [{ $count: "n" }],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        },
      },
    ]),
  ]);

  // Reshape aggregation results into a flat, readable object
  const roleMap = Object.fromEntries(
    userStats[0].byRole.map((r) => [r._id, r.count])
  );
  const pgStatusMap = Object.fromEntries(
    pgStats[0].byStatus.map((s) => [s._id, s.count])
  );
  const bookingStatusMap = Object.fromEntries(
    (bookingStats.byStatus || []).map((s) => [s._id, s.count])
  );

  res.status(200).json({
    success: true,
    stats: {
      users: {
        total: userStats[0].total[0]?.n || 0,
        owners: roleMap.owner || 0,
        regular: roleMap.user || 0,
        admins: roleMap.admin || 0,
        blocked: userStats[0].blocked[0]?.n || 0,
        deleted: userStats[0].deleted[0]?.n || 0,
      },
      pgs: {
        total: pgStats[0].total[0]?.n || 0,
        pending: pgStatusMap.pending || 0,
        approved: pgStatusMap.approved || 0,
        rejected: pgStatusMap.rejected || 0,
      },
      bookings: {
        total: bookingStats.total[0]?.n || 0,
        pending: bookingStatusMap.pending || 0,
        approved: bookingStatusMap.approved || 0,
        rejected: bookingStatusMap.rejected || 0,
        cancelled: bookingStatusMap.cancelled || 0,
      },
    },
  });
});