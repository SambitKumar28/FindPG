import PG from "../models/PG.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * FIX #14 — Uploads a single file buffer to Cloudinary.
 * Called via Promise.all for parallel uploads instead of sequential await.
 */
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "findpg" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
    stream.end(buffer);
  });

/** Whitelist of fields an owner is allowed to update on their own PG listing. */
const OWNER_UPDATABLE_FIELDS = [
  "title",
  "description",
  "city",
  "locality",
  "address",
  "rent",
  "securityDeposit",
  "genderPreference",
  "roomType",
  "amenities",
  "isAvailable",
];

// ─── CREATE PG ───────────────────────────────────────────────────────────────

export const createPG = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    city,
    locality,
    address,
    rent,
    securityDeposit,
    genderPreference,
    roomType,
    amenities,
  } = req.body;

  // FIX #14 — Upload all images in parallel instead of sequentially
  const imageUrls =
    req.files?.length > 0
      ? await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)))
      : [];

  const pg = await PG.create({
    title,
    description,
    city,
    locality,
    address,
    rent,
    securityDeposit,
    genderPreference,
    roomType,
    amenities: Array.isArray(amenities) ? amenities : [],
    images: imageUrls,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "PG listed successfully — pending admin approval",
    pg,
  });
});

// ─── GET ALL PGs (public) ─────────────────────────────────────────────────────

export const getAllPGs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    keyword,
    genderPreference,
    roomType,
    minRent,
    maxRent,
    sort,
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit))); // cap at 50 per page

  // FIX #10 — Only show approved, non-deleted listings on the public endpoint
  const query = { isDeleted: false, approvalStatus: "approved" };

  if (keyword) {
    query.$text = { $search: keyword }; // use the text index properly
  }

  if (genderPreference) query.genderPreference = genderPreference;
  if (roomType) query.roomType = roomType;

  if (minRent || maxRent) {
    query.rent = {};
    if (minRent) query.rent.$gte = Number(minRent);
    if (maxRent) query.rent.$lte = Number(maxRent);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "rentLowToHigh") sortOption = { rent: 1 };
  else if (sort === "rentHighToLow") sortOption = { rent: -1 };

  const skip = (pageNum - 1) * limitNum;

  const [pgs, total] = await Promise.all([
    PG.find(query)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    PG.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
      limit: limitNum,
    },
    data: pgs,
  });
});

// ─── GET SINGLE PG ───────────────────────────────────────────────────────────

export const getPGById = asyncHandler(async (req, res) => {
  const pg = await PG.findOne({
    _id: req.params.id,
    isDeleted: false,
    approvalStatus: "approved",
  })
    .populate("owner", "name email phone")
    .lean();

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  res.status(200).json({ success: true, pg });
});

// ─── UPDATE PG ───────────────────────────────────────────────────────────────

export const updatePG = asyncHandler(async (req, res) => {
  const pg = await PG.findOne({ _id: req.params.id, isDeleted: false });

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  if (
    pg.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this listing");
  }

  // FIX #3 — Whitelist allowed fields instead of Object.assign(pg, req.body)
  OWNER_UPDATABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) {
      pg[field] = req.body[field];
    }
  });

  // FIX #8 — Replace images using buffer (memoryStorage), parallel upload
  if (req.files?.length > 0) {
    // Delete old images from Cloudinary first
    await Promise.allSettled(
      pg.images.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    // FIX #14 — Upload new images in parallel
    pg.images = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer))
    );
  }

  const updatedPG = await pg.save();

  res.status(200).json({
    success: true,
    message: "PG updated successfully",
    pg: updatedPG,
  });
});

// ─── DELETE PG ───────────────────────────────────────────────────────────────

export const deletePG = asyncHandler(async (req, res) => {
  const pg = await PG.findOne({ _id: req.params.id, isDeleted: false });

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  if (
    pg.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this listing");
  }

  // Delete Cloudinary images concurrently (don't block on failure)
  await Promise.allSettled(
    pg.images.map((img) => cloudinary.uploader.destroy(img.public_id))
  );

  // Soft delete
  pg.isDeleted = true;
  await pg.save();

  res.status(200).json({
    success: true,
    message: "PG listing deleted successfully",
  });
});

// ─── GET OWNER'S OWN PGs ─────────────────────────────────────────────────────

export const getMyPGs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [pgs, total] = await Promise.all([
    PG.find({ owner: req.user._id, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    PG.countDocuments({ owner: req.user._id, isDeleted: false }),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    },
    data: pgs,
  });
});
