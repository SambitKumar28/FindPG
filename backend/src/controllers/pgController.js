import PG from '../models/PG.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

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

  const imageUrls = req.files
    ? req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }))
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
    amenities,
    images: imageUrls,
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'PG listing created successfully',
    pg,
  });
});

export const getAllPGs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const keyword = req.query.keyword
    ? {
        $or: [
          { city: { $regex: req.query.keyword, $options: 'i' } },
          { locality: { $regex: req.query.keyword, $options: 'i' } },
          { title: { $regex: req.query.keyword, $options: 'i' } },
        ],
        }
    : {};

  const filters = {
    ...keyword,
  };

  if (req.query.genderPreference) {
    filters.genderPreference = req.query.genderPreference;
  }

  if (req.query.roomType) {
    filters.roomType = req.query.roomType;
  }

  if (req.query.minRent || req.query.maxRent) {
    filters.rent = {};

    if (req.query.minRent) {
      filters.rent.$gte = Number(req.query.minRent);
    }

    if (req.query.maxRent) {
      filters.rent.$lte = Number(req.query.maxRent);
    }
  }

  let sortOption = { createdAt: -1 };

  if (req.query.sort === 'rentLowToHigh') {
    sortOption = { rent: 1 };
  }

  if (req.query.sort === 'rentHighToLow') {
    sortOption = { rent: -1 };
  }

  const totalPGs = await PG.countDocuments(filters);

  const pgs = await PG.find(filters)
    .populate('owner', 'name email')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);


  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages: Math.ceil(totalPGs / limit),
    totalPGs,
    count: pgs.length,
    pgs,
  });
});

export const getPGById = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id).populate(
    'owner',
    'name email phone'
  );

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  res.status(200).json({
    success: true,
    pg,
  });
});


export const updatePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  if (pg.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to update this PG');
  }

  if (req.files && req.files.length > 0) {
    for (const image of pg.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    pg.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }

  pg.title = req.body.title || pg.title;
  pg.description = req.body.description || pg.description;
  pg.city = req.body.city || pg.city;
  pg.locality = req.body.locality || pg.locality;
  pg.address = req.body.address || pg.address;
  pg.rent = req.body.rent || pg.rent;
  pg.securityDeposit = req.body.securityDeposit || pg.securityDeposit;
  pg.genderPreference =
    req.body.genderPreference || pg.genderPreference;
  pg.roomType = req.body.roomType || pg.roomType;
  pg.amenities = req.body.amenities || pg.amenities;

  const updatedPG = await pg.save();

  res.status(200).json({
    success: true,
    message: 'PG updated successfully',
    pg: updatedPG,
  });
});

export const deletePG = asyncHandler(async (req, res) => {
  const pg = await PG.findById(req.params.id);

  if (!pg) {
    res.status(404);
    throw new Error('PG not found');
  }

  if (pg.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You are not authorized to delete this PG');
  }

  await pg.deleteOne();


  res.status(200).json({
    success: true,
    message: 'PG deleted successfully',
  });
});