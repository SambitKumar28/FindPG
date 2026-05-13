import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: [true, "PG is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    moveInDate: {
      type: Date,
      required: [true, "Move-in date is required"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── FIX #17 — Indexes for common query patterns ──────────────────────────────
// user dashboard: { user, createdAt }
bookingSchema.index({ user: 1, createdAt: -1 });
// owner dashboard: { owner, createdAt }
bookingSchema.index({ owner: 1, createdAt: -1 });
// admin lookups: { pg }
bookingSchema.index({ pg: 1 });
// duplicate booking check: { user, pg, status }
bookingSchema.index({ user: 1, pg: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;