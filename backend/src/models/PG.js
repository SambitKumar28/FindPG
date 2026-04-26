import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    locality: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    address: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    genderPreference: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },

    roomType: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    //  FIXED IMAGE STRUCTURE
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    //  Future-ready (optional but strong)
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//  Text search (very useful)
pgSchema.index({
  title: "text",
  city: "text",
  locality: "text",
});

const PG = mongoose.model("PG", pgSchema);

export default PG;