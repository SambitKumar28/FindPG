import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email"],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Phone must be a 10-digit number"],
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },

    profileImage: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PG",
      },
    ],

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    /**
     * FIX #6 — Refresh token revocation via version counter.
     * Incrementing this number (on logout or password change) invalidates
     * ALL outstanding refresh tokens for the user without needing a blocklist.
     */
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Hooks ───────────────────────────────────────────────────────────────────

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Instance Methods ─────────────────────────────────────────────────────────

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/** Invalidate all outstanding refresh tokens for this user. */
userSchema.methods.invalidateTokens = async function () {
  this.tokenVersion += 1;
  await this.save({ validateBeforeSave: false });
};

// ─── Safe public projection ───────────────────────────────────────────────────

userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    profileImage: this.profileImage,
    city: this.city,
    isBlocked: this.isBlocked,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;