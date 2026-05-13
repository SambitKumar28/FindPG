import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    locality: {
      type: String,
      required: [true, "Locality is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    rent: {
      type: Number,
      required: [true, "Rent is required"],
      min: [0, "Rent cannot be negative"],
    },

    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, "Security deposit cannot be negative"],
    },

    genderPreference: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },

    roomType: {
      type: String,
      enum: ["single", "double", "triple"],
      required: [true, "Room type is required"],
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// FIX: text index for full-text search (replaces separate field indexes on
//      city/locality which would conflict with the text index)
pgSchema.index({ title: "text", city: "text", locality: "text" });

// Compound index for the most common public listing query
pgSchema.index({ approvalStatus: 1, isDeleted: 1, rent: 1 });

// Owner's own listings
pgSchema.index({ owner: 1, isDeleted: 1, createdAt: -1 });

const PG = mongoose.model("PG", pgSchema);

export default PG;