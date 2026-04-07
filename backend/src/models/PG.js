import mongoose from 'mongoose';

const pgSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    locality: {
      type: String,
      required: true,
      trim: true,
       },
    address: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    genderPreference: {
      type: String,
      enum: ['male', 'female', 'unisex'],
      default: 'unisex',
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'triple'],
      required: true,
      },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending',
},
images: [
  {
    public_id: String,
    url: String,
  },
],
    },
  {
    timestamps: true,
  }
);

const PG = mongoose.model('PG', pgSchema);

export default PG;