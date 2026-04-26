import Booking from "../models/Booking.js";
import PG from "../models/PG.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// ================= CREATE BOOKING =================
export const createBooking = asyncHandler(async (req, res) => {
  const { pgId, moveInDate, message } = req.body;

  if (!pgId || !moveInDate) {
    res.status(400);
    throw new Error("PG ID and move-in date are required");
  }

  const pg = await PG.findById(pgId);

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  // Prevent duplicate pending bookings
  const existingBooking = await Booking.findOne({
    user: req.user._id,
    pg: pgId,
    status: "pending",
  });

  if (existingBooking) {
    res.status(400);
    throw new Error("You already have a pending booking");
  }

  const booking = await Booking.create({
    user: req.user._id,
    pg: pg._id,
    owner: pg.owner,
    moveInDate,
    message,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    booking,
  });
});

// ================= USER BOOKINGS =================
export const getMyBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ user: req.user._id })
      .populate("pg", "title city locality rent images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments({ user: req.user._id }),
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

// ================= OWNER BOOKINGS =================
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ owner: req.user._id })
      .populate("user", "name email")
      .populate("pg", "title city locality rent")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments({ owner: req.user._id }),
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

// ================= APPROVE =================
export const approveBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Owner OR Admin
  if (
    booking.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Only pending bookings can be approved");
  }

  booking.status = "approved";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking approved",
    booking,
  });
});

// ================= REJECT =================
export const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (
    booking.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Only pending bookings can be rejected");
  }

  booking.status = "rejected";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking rejected",
    booking,
  });
});

// ================= CANCEL =================
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Only user OR admin
  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (booking.status !== "pending") {
    res.status(400);
    throw new Error("Only pending bookings can be cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled",
    booking,
  });
});