import User from "../models/User.js";
import PG from "../models/PG.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// ─── GET FAVORITES ────────────────────────────────────────────────────────────

/**
 * FIX #9 — Mongoose populate() does NOT support skip/limit for arrays.
 * Correct approach: load the full favorites array then slice in memory.
 * For very large favorites lists a separate Favorite collection would be better,
 * but this is fine for the typical use case here.
 */
export const getFavorites = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const user = await User.findById(req.user._id)
    .populate({
      path: "favorites",
      match: { isDeleted: false },              // exclude deleted PGs
      select: "title city locality rent images approvalStatus",
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  const total = user.favorites.length;
  const skip = (page - 1) * limit;
  const paginated = user.favorites.slice(skip, skip + limit);

  res.status(200).json({
    success: true,
    pagination: { total, page, pages: Math.ceil(total / limit) },
    data: paginated,
  });
});

// ─── ADD TO FAVORITES ─────────────────────────────────────────────────────────

export const addToFavorites = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const pgExists = await PG.exists({ _id: pgId, isDeleted: false });
  if (!pgExists) {
    res.status(404);
    throw new Error("PG not found");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: pgId } }, // $addToSet is atomic — no race condition
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Added to favourites",
  });
});

// ─── REMOVE FROM FAVORITES ────────────────────────────────────────────────────

export const removeFromFavorites = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: pgId } }, // $pull is atomic
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Removed from favourites",
  });
});

// ─── TOGGLE FAVORITE ──────────────────────────────────────────────────────────

/**
 * FIX #13 — The previous implementation had a read-modify-write race condition
 * (read user, check JS, then update). Two simultaneous requests could both see
 * the PG as "not a favorite" and both add it.
 *
 * Fix: Accept an explicit 'action' ('add' | 'remove') from the client, which
 * already knows the current state, and apply the appropriate atomic operation.
 * If the client sends 'add' when it's already added, $addToSet is a no-op.
 * If the client sends 'remove' when it's already gone, $pull is a no-op.
 * Both operations are fully atomic on the MongoDB side.
 */
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { pgId } = req.params;
  const { action } = req.body; // expected: 'add' | 'remove'

  if (!["add", "remove"].includes(action)) {
    res.status(400);
    throw new Error('action must be "add" or "remove"');
  }

  if (action === "add") {
    const pgExists = await PG.exists({ _id: pgId, isDeleted: false });
    if (!pgExists) {
      res.status(404);
      throw new Error("PG not found");
    }
  }

  const update =
    action === "add"
      ? { $addToSet: { favorites: pgId } }
      : { $pull: { favorites: pgId } };

  await User.findByIdAndUpdate(req.user._id, update);

  res.status(200).json({
    success: true,
    message: action === "add" ? "Added to favourites" : "Removed from favourites",
  });
});