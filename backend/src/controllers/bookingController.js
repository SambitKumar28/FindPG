import Booking from "../models/Booking.js";
import PG from "../models/PG.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parsePagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ─── CREATE BOOKING ───────────────────────────────────────────────────────────

export const createBooking = asyncHandler(async (req, res) => {
  const { pgId, moveInDate, message } = req.body;

  if (!pgId || !moveInDate) {
    res.status(400);
    throw new Error("PG ID and move-in date are required");
  }

  // Validate move-in date is in the future
  const date = new Date(moveInDate);
  if (isNaN(date.getTime()) || date <= new Date()) {
    res.status(400);
    throw new Error("Move-in date must be a valid future date");
  }

  const pg = await PG.findOne({
    _id: pgId,
    isDeleted: false,
    approvalStatus: "approved",
    isAvailable: true,
  });

  if (!pg) {
    res.status(404);
    throw new Error("PG not found or is not currently available for booking");
  }

  // Prevent duplicate pending bookings (index on { user, pg, status } makes this fast)
  const existingBooking = await Booking.findOne({
    user: req.user._id,
    pg: pgId,
    status: "pending",
  });

  if (existingBooking) {
    res.status(409);
    throw new Error("You already have a pending booking request for this PG");
  }

  const booking = await Booking.create({
    user: req.user._id,
    pg: pg._id,
    owner: pg.owner,
    moveInDate: date,
    message,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Booking request submitted successfully",
    booking,
  });
});

// ─── USER BOOKINGS ────────────────────────────────────────────────────────────

export const getMyBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [bookings, total] = await Promise.all([
    Booking.find({ user: req.user._id })
      .populate("pg", "title city locality rent images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    pagination: { total, page, pages: Math.ceil(total / limit) },
    data: bookings,
  });
});

// ─── OWNER BOOKINGS ───────────────────────────────────────────────────────────

export const getOwnerBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);

  const [bookings, total] = await Promise.all([
    Booking.find({ owner: req.user._id })
      .populate("user", "name email phone")
      .populate("pg", "title city locality rent")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments({ owner: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    pagination: { total, page, pages: Math.ceil(total / limit) },
    data: bookings,
  });
});

// ─── Shared status-change helper ──────────────────────────────────────────────

const changeBookingStatus = async (req, res, newStatus, authorizeCheck) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (!authorizeCheck(booking, req.user)) {
    res.status(403);
    throw new Error("Not authorized to modify this booking");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error(`Only pending bookings can be ${newStatus}`);
  }

  booking.status = newStatus;
  await booking.save();

  res.status(200).json({
    success: true,
    message: `Booking ${newStatus}`,
    booking,
  });
};

// ─── APPROVE ─────────────────────────────────────────────────────────────────

export const approveBooking = asyncHandler(async (req, res) =>
  changeBookingStatus(req, res, "approved", (b, user) =>
    b.owner.toString() === user._id.toString() || user.role === "admin"
  )
);

// ─── REJECT ──────────────────────────────────────────────────────────────────

export const rejectBooking = asyncHandler(async (req, res) =>
  changeBookingStatus(req, res, "rejected", (b, user) =>
    b.owner.toString() === user._id.toString() || user.role === "admin"
  )
);

// ─── CANCEL ───────────────────────────────────────────────────────────────────

export const cancelBooking = asyncHandler(async (req, res) =>
  changeBookingStatus(req, res, "cancelled", (b, user) =>
    b.user.toString() === user._id.toString() || user.role === "admin"
  )
);