import User from "../models/User.js";
import PG from "../models/PG.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// ================= GET FAVORITES =================
export const getFavorites = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.user._id)
    .populate({
      path: "favorites",
      select: "title city locality rent images",
      options: {
        skip: (page - 1) * limit,
        limit: Number(limit),
      },
    })
    .lean();

  res.status(200).json({
    success: true,
    count: user.favorites.length,
    data: user.favorites,
  });
});

// ================= ADD =================
export const addToFavorites = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const pgExists = await PG.exists({ _id: pgId });
  if (!pgExists) {
    res.status(404);
    throw new Error("PG not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: pgId } }, // prevents duplicates
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Added to favorites",
    favorites: updatedUser.favorites,
  });
});

// ================= REMOVE =================
export const removeFromFavorites = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: pgId } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Removed from favorites",
    favorites: updatedUser.favorites,
  });
});

// ================= TOGGLE (BEST PRACTICE) =================
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const user = await User.findById(req.user._id);

  const isFavorite = user.favorites.includes(pgId);

  const update = isFavorite
    ? { $pull: { favorites: pgId } }
    : { $addToSet: { favorites: pgId } };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    update,
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: isFavorite
      ? "Removed from favorites"
      : "Added to favorites",
    favorites: updatedUser.favorites,
  });
});