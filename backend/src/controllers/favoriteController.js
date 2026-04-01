import User from '../models/User.js';
import PG from '../models/PG.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// @desc    Get all favorite PGs
// @route   GET /api/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    select: 'title city locality rent images gender roomType amenities',
  });

  res.status(200).json({
    success: true,
    count: user.favorites.length,
    favorites: user.favorites,
  });
});

// @desc    Add PG to favorites
// @route   POST /api/favorites/:pgId
// @access  Private
export const addToFavorites = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const pg = await PG.findById(pgId);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  const user = await User.findById(req.user._id);

  const alreadyFavorite = user.favorites.includes(pgId);

  if (alreadyFavorite) {
    res.status(400);
    throw new Error('PG already added to favorites');
  }

  user.favorites.push(pgId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'PG added to favorites successfully',
    favorites: user.favorites,
  });
});

// @desc    Remove PG from favorites
// @route   DELETE /api/favorites/:pgId
// @access  Private
export const removeFromFavorites = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const user = await User.findById(req.user._id);

  user.favorites = user.favorites.filter(
    (favoriteId) => favoriteId.toString() !== pgId
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: 'PG removed from favorites successfully',
    favorites: user.favorites,
  });
});