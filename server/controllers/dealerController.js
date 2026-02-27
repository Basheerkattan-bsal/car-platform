const Car = require('../models/Car');
const DealerProfile = require('../models/DealerProfile');

exports.createDealerProfile = async (req, res) => {
  try {
    const existingProfile = await DealerProfile.findOne({ user: req.user.id });

    if (existingProfile) {
      return res.status(400).json({ message: 'Dealer Profile already exists' });
    }

    const profile = await DealerProfile.create({
      user: req.user.id,
      companyName: req.body.companyName,
      phone: req.body.phone,
      address: req.body.address,
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await DealerProfile.findOne({ user: req.user.id })
      .select(
        'companyName, phone address status rejectionReason moderation createdAt updatedAt'
      )
      .populate('user', 'name email role');

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: 'Dealer profile not found' });
    }

    const safeData = {
      id: profile._id,
      user: profile.user,
      canPostCars: profile.status === 'approved',
      companyName: profile.companyName,
      phone: profile.phone,
      address: profile.address,
      status: profile.status,
      rejectionReason:
        profile.status === 'rejected' ? profile.rejectionReason : '',
      lastModeration: profile.moderation?.at
        ? {
            lastAction: profile.moderation.lastAction,
            at: profile.moderation.at,
          }
        : null,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data: safeData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  console.log('✅ updateMyProfile HIT', req.method, req.originalUrl);
  try {
    const allowedFields = ['companyName', 'phone', 'address'];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body && req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }
    const updated = await DealerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    ).maxTimeMS(5000);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Dealer profile not found',
      });
    }

    const populated = await DealerProfile.findById(updated._id)
      .populate('user', 'name email role')
      .maxTimeMS(5000);

    return res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyStats = async (req, res) => {
  try {
    const profile = await DealerProfile.findOne({ user: req.user.id })
      .select('status')
      .maxTimeMS(5000);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found',
      });
    }
    const [totalCars, latestCars] = await Promise.all([
      Car.countDocuments({ dealer: req.user.id }),
      Car.find({ dealer: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title brand price year mileage createdAt'),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        dealerStatus: profile.status,
        canPostCars: profile.status === 'approved',
        totalCars,
        latestCars,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyCarsPaginated = async (req, res) => {
  const parseNum = v => {
    if (v === undefined) return null;
    const n = Number(String(v).trim());
    return Number.isFinite(n) ? n : null;
  };
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '10', 10), 1),
      50
    );
    const skip = (page - 1) * limit;

    const filter = { dealer: req.user.id };
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    const minPrice = parseNum(req.query.minPrice);
    const maxPrice = parseNum(req.query.maxPrice);
    /*   const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null; */

    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    /*  const minYear = req.query.minYear ? Number(req.query.minYear) : null;
    const maxYear = req.query.maxYear ? Number(req.query.maxYear) : null; */
    const minYear = parseNum(req.query.minYear);
    const maxYear = parseNum(req.query.maxYear);

    if (minYear !== null || maxYear !== null) {
      filter.year = {};
    }
    if (minYear !== null) filter.year.$gte = minYear;
    if (maxYear !== null) filter.year.$lte = maxYear;

    const [totalCars, cars] = await Promise.all([
      Car.countDocuments(filter),
      Car.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);
    return res.status(200).json({
      success: true,
      filterUsed: filter,
      pagination: {
        page,
        limit,
        totalCars,
        totalPages: Math.ceil(totalCars / limit),
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
