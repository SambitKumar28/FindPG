import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
         phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'owner', 'admin'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PG',
      },
    ],
    favorites: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PG',
   },
   ],
  },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema);

export default User;