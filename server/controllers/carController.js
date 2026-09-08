const mongoose = require('mongoose');
const Car = require('../models/Car');
const path = require('path');
const fs = require('fs');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createCarSchema } = require('../validations/car.validations');
const { updateCarSchema } = require('../validations/car.validations');

const normalizeUploadUrl = input => {
  if (typeof input !== 'string') return '';
  const v = input.trim();

  // For user sending full URL , extract the pathname
  if (v.startsWith('http://') || v.startsWith('https://')) {
    try {
      const u = new URL(v);
      return u.pathname;
    } catch {
      return v;
    }
  }
  return v;
};

const parseNum = v => {
  if (v === undefined || v === null) return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
};

const DealerProfile = require('../models/DealerProfile');
const { pickAllAllowedFields } = require('../utils/pickAllowedFields');
const { escape } = require('querystring');

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('dealer', 'name email role');
    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      'dealer',
      'name email role'
    );
    res.json({
      success: true,
      data: car,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCarsPublic = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '12', 10), 1),
      50
    );
    const skip = (page - 1) * limit;
    const filter = { isPublished: true };
    if (req.query.brand) {
      const b = String(req.query.brand).trim();
      if (b) {
        const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.brand = {
          $regex: escaped,
          $options: 'i',
        };
      }
    }

    const minPrice = parseNum(req.query.minPrice);
    const maxPrice = parseNum(req.query.maxPrice);
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    const minYear = parseNum(req.query.minYear);
    const maxYear = parseNum(req.query.maxYear);
    if (minYear !== null || maxYear !== null) {
      filter.year = {};
      if (minYear !== null) filter.year.$gte = minYear;
      if (maxYear !== null) filter.year.$lte = maxYear;
    }

    // Read sort params + build sort object :
    const sortKey =
      typeof req.query.sort === 'string' ? req.query.sort.trim() : 'newest';
    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      year_desc: { year: -1 },
    };
    const sort = sortMap[sortKey] || sortMap.newest;
    const [totalCars, cars] = await Promise.all([
      Car.countDocuments(filter),
      Car.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          'title price mainImage images brand year mileage owner condition createdAt dealer'
        ),
    ]);
    const totalPages = totalCars === 0 ? 0 : Math.ceil(totalCars / limit);

    return res.status(200).json({
      success: true,
      sortUsed: sortKey,
      pagination: {
        page,
        limit,
        totalCars,
        totalPages,
      },
      data: cars,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCarBrandsPublic = async (req, res) => {
  try {
    const brands = await Car.distinct('brand', { isPublished: true });

    // Normalize + sort (stable UX)
    const cleaned = brands
      .filter(b => typeof b === 'string' && b.trim() !== '')
      .map(b => b.trim())
      .sort((a, b) => a.localeCompare(b));

    return res.status(200).json({
      success: true,
      count: cleaned.length,
      data: cleaned,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCarByIdPublic = async (req, res) => {
  try {
    const carId = req.params.id.trim();
    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }
    const car = await Car.findOne({ _id: carId, isPublished: true }).populate(
      'dealer',
      'name email role'
    );
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    const dealerProfile =
      car.dealer && car.dealer._id
        ? await DealerProfile.findOne({ user: car.dealer._id }).select(
            'companyName phone address'
          )
        : null;

    const similarFilter = {
      _id: { $ne: car._id },
      isPublished: true,
    };

    if (car.brand) {
      similarFilter.brand = car.brand;
    }

    const similarCars = await Car.find(similarFilter)
      .sort({ createdAt: -1 })
      .limit(4)
      .select(
        'title price mainImage images brand year mileage owner condition createdAt dealer'
      );
    return res.status(200).json({
      success: true,
      data: car,
      dealerProfile,
      similarCars,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.createCar = async (req, res) => {
  try {
    const dealerProfile = await DealerProfile.findOne({ user: req.user.id });

    if (!dealerProfile) {
      return res.status(403).json({
        success: false,
        message: 'Dealer not found',
      });
    }

    if (dealerProfile.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Dealer is not approved (status: ${dealerProfile.status})`,
      });
    }

    const parsed = createCarSchema.safeParse(req.body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => ({
        filed: i.path.join('.'),
        message: i.message,
      }));
      return res.status(400).json({
        success: false,
        message: issues.map(e => `${e.filed}: ${e.message}`).join(', '),
        errors: issues,
      });
    }

    const car = await Car.create({
      ...parsed.data,
      dealer: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: car,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id.trim();
    const parsed = updateCarSchema.safeParse(req.body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      }));

      return res.status(400).json({
        success: false,
        message: issues.map(e => `${e.field}: ${e.message}`).join('; '),
        errors: issues,
      });
    }

    const updates = parsed.data;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: ' NO valid fields provided for update' });
    }

    const updateCar = await Car.findOneAndUpdate(
      { _id: carId, dealer: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updateCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found (or you don't won it)",
      });
    }

    return res.status(200).json({
      success: true,
      data: updateCar,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    await req.car.deleteOne();

    res.json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ dealer: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.publishMyCar = async (req, res) => {
  try {
    const carId = req.params.id.trim();
    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }
    const update = await Car.findOneAndUpdate(
      { _id: carId, dealer: req.user.id },
      { $set: { isPublished: true } },
      { new: true, runValidators: true }
    );
    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Car not found (or you don't own it)",
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Car published',
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unpublishMyCar = async (req, res) => {
  try {
    const carId = req.params.id.trim();
    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }
    const update = await Car.findOneAndUpdate(
      { _id: carId, dealer: req.user.id },
      { $set: { isPublished: false } },
      { new: true, runValidators: true }
    );
    if (!update) {
      return res.status(404).json({
        success: false,
        message: "Cat not found (or you don't own it)",
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Car unpublished',
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMyCar = async (req, res) => {
  try {
    const carId = req.params.id.trim();

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }

    const allowedFields = [
      'title',
      'price',
      'brand',
      'model',
      'year',
      'mileage',
      'owner',
      'condition',
      'description',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    const updated = await Car.findOneAndUpdate(
      { _id: carId, dealer: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Car not found (or you don't own it)",
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMyCar = async (req, res) => {
  try {
    const carId = req.params.id.trim();

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }
    const deleted = await Car.findOneAndDelete({
      _id: carId,
      dealer: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Car is not found (or you don't own it)",
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadMyCarImages = async (req, res) => {
  try {
    const carId = req.params.id.trim();

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: ' No images to upload',
      });
    }

    const urls = req.files.map(f => `/uploads/${f.filename}`);

    const car = await Car.findOne({ _id: carId, dealer: req.user.id });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found (or you don\t own it)',
      });
    }

    const MAX_IMAGES = 8;

    if (car.images.length >= MAX_IMAGES) {
      return res.status(400).json({
        success: false,
        message: `Max ${MAX_IMAGES} images allowed`,
      });
    }
    const remaining = MAX_IMAGES - car.images.length;
    const urlsToAdd = urls.slice(0, remaining);

    car.images.push(...urls);

    if (!car.mainImage && urlsToAdd.length > 0) {
      car.mainImage = urlsToAdd[0];
    }
    await car.save();

    return res.status(200).json({
      success: true,
      message: 'Images uploaded',
      data: car,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMyCarImage = async (req, res) => {
  try {
    const carId = req.params.id.trim();
    const url = typeof req.body.url === 'string' ? req.body.url.trim() : '';

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }

    if (!url || !url.startsWith('/uploads')) {
      return res.status(400).json({
        success: false,
        message: 'Valid image url is required (must starts with /uploads/...)',
      });
    }

    const car = await Car.findOne({ _id: carId, dealer: req.user.id });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found (or you don\t own it)',
      });
    }

    car.images = car.images.filter(img => img !== url);

    if (car.mainImage === url) {
      car.mainImage = car.images.length > 0 ? car.images[0] : '';
    }

    await car.save();

    /*    const filename = url.replace('/uploads', '');
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    fs.unlink(filePath, err => {}); */

    return res.status(200).json({
      success: true,
      message: 'Image removed',
      data: car,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.setCarMainImage = asyncHandler(async (req, res) => {
  const carId = req.params.id.trim();
  const url = normalizeUploadUrl(req.body.url);

  if (!mongoose.isValidObjectId(carId)) {
    throw new AppError('Invalid car id', 404);
  }

  if (!url || !url.startsWith('/uploads/')) {
    throw new AppError(
      'Valid image url is required (must starts with /uploads/...',
      400
    );
  }

  const car = await Car.findOne({ _id: carId, dealer: req.user.id });

  if (!car) {
    throw new AppError("Car not found (or you don't own it)", 404);
  }

  if (!car.images.includes(url)) {
    throw new AppError('Image url must exist in car.images', 400);
  }

  car.mainImage = url;
  await car.save();

  return res.status(200).json({
    success: true,
    message: 'Main image updated',
    data: car,
  });
});
