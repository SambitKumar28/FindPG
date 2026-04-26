import PG from "../models/PG.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";

// ================= CREATE PG =================
export const createPG = asyncHandler(async (req, res) => {
  const imageUrls = req.files?.map((file) => ({
    public_id: file.filename,
    url: file.path,
  })) || [];

  const pg = await PG.create({
    ...req.body,
    images: imageUrls,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "PG created successfully",
    pg,
  });
});

// ================= GET ALL PGs =================
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

  const query = {};

  //  Search
  if (keyword) {
    query.$or = [
      { city: { $regex: keyword, $options: "i" } },
      { locality: { $regex: keyword, $options: "i" } },
      { title: { $regex: keyword, $options: "i" } },
    ];
  }

  //  Filters
  if (genderPreference) query.genderPreference = genderPreference;
  if (roomType) query.roomType = roomType;

  if (minRent || maxRent) {
    query.rent = {};
    if (minRent) query.rent.$gte = Number(minRent);
    if (maxRent) query.rent.$lte = Number(maxRent);
  }

  //  Sorting
  let sortOption = { createdAt: -1 };
  if (sort === "rentLowToHigh") sortOption = { rent: 1 };
  if (sort === "rentHighToLow") sortOption = { rent: -1 };

  const skip = (page - 1) * limit;

  const [pgs, total] = await Promise.all([
    PG.find(query)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    PG.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: pgs,
  });
});

// ================= GET SINGLE PG =================
export const getPGById = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id).populate(
    "owner",
    "name email"
  );

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  res.status(200).json({
    success: true,
    pg,
  });
});

// ================= UPDATE PG =================
export const updatePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  //  Owner OR Admin can update
  if (
    pg.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  //  Replace Images
  if (req.files?.length > 0) {
    try {
      await Promise.all(
        pg.images.map((img) =>
          cloudinary.uploader.destroy(img.public_id)
        )
      );
    } catch (err) {
      console.error("Image delete failed:", err.message);
    }

    pg.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }

  Object.assign(pg, req.body);

  const updatedPG = await pg.save();

  res.status(200).json({
    success: true,
    message: "PG updated successfully",
    pg: updatedPG,
  });
});

// ================= DELETE PG =================
export const deletePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error("PG not found");
  }

  //  Owner OR Admin
  if (
    pg.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  //  Delete Images from Cloudinary
  try {
    await Promise.all(
      pg.images.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      )
    );
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }

  await pg.deleteOne();

  res.status(200).json({
    success: true,
    message: "PG deleted successfully",
  });
});