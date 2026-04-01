import Booking from '../models/Booking.js';
import PG from '../models/PG.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { pgId, moveInDate, message } = req.body;

  if (!pgId || !moveInDate) {
    res.status(400);
    throw new Error('PG ID and move-in date are required');
  }

  const pg = await PG.findById(pgId);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  const existingBooking = await Booking.findOne({
    user: req.user._id,
    pg: pgId,
    status: 'pending',
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('You already have a pending booking request for this PG');
  }

  const booking = await Booking.create({
    user: req.user._id,
    pg: pg._id,
    owner: pg.owner,
    moveInDate,
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Booking request created successfully',
    booking,
  });
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('pg', 'title city locality rent images')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// @desc    Get booking requests for PG owner
// @route   GET /api/bookings/owner
// @access  Private
export const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .populate('user', 'name email phone')
    .populate('pg', 'title city locality rent')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// @desc    Approve booking request
// @route   PUT /api/bookings/:id/approve
// @access  Private
export const approveBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to approve this booking');
  }

  booking.status = 'approved';
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking approved successfully',
    booking,
  });
});

// @desc    Reject booking request
// @route   PUT /api/bookings/:id/reject
// @access  Private
export const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to reject this booking');
  }

  booking.status = 'rejected';
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking rejected successfully',
    booking,
  });
});

// @desc    Cancel booking request
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    booking,
  });
});