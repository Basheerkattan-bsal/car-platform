const DealerProfile = require('../models/DealerProfile');
const mongoose = require('mongoose');
const { isValidObjectId } = require('../utils/validateObjectId');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

exports.approveDealer = async (req, res) => {
  try {
    const dealerId = req.params.id.trim();

    if (!isValidObjectId(dealerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dealer profile id',
      });
    }

    const dealer = await DealerProfile.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found',
      });
    }

    dealer.status = 'approved';
    dealer.rejectionReason = '';
    dealer.moderation = {
      lastAction: 'approved',
      by: req.user.id,
      at: new Date(),
    };

    await dealer.save();

    return res.status(200).json({
      success: true,
      message: 'Dealer approved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.rejectDealer = async (req, res) => {
  try {
    const { reason } = req.body;
    const dealerId = req.params.id.trim();

    if (!reason || typeof reason !== 'string' || reason.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required (min 5 characters)',
      });
    }

    if (!isValidObjectId(dealerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dealer profile id',
      });
    }

    const dealer = await DealerProfile.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found',
      });
    }
    dealer.status = 'rejected';
    dealer.rejectionReason = reason.trim();
    dealer.moderation = {
      lastAction: 'rejected',
      by: req.user.id,
      at: new Date(),
    };
    await dealer.save();

    return res.status(200).json({
      success: true,
      message: 'Dealer rejected successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.suspendDealer = async (req, res) => {
  try {
    const dealerId = req.params.id.trim();

    if (!isValidObjectId(dealerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dealer profile id',
      });
    }

    const dealer = await DealerProfile.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found',
      });
    }
    dealer.status = 'suspended';
    dealer.moderation = {
      lastAction: 'approved',
      by: req.user.id,
      at: new Date(),
    };
    await dealer.save();

    return res.status(200).json({
      success: true,
      message: 'Dealer suspended successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.reactivateDealer = async (req, res) => {
  try {
    const dealerId = req.params.id.trim();

    if (!isValidObjectId(dealerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dealer profile id',
      });
    }

    const to = (req.query.to || 'pending').trim();

    if (!['pending', 'approved'].includes(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid "to" value. Allowed: pending, approved',
      });
    }

    const updated = await DealerProfile.findByIdAndUpdate(
      dealerId,
      {
        $set: {
          status: to,
          rejectionReason: '',
          moderation: {
            lastAction: 'reactivated',
            by: req.user.id,
            at: new Date(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Dealer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Dealer reactivated and moved to pending',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDealerById = async (req, res) => {
  try {
    const dealerId = req.params.id;

    if (!isValidObjectId(dealerId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid dealer profile id',
      });
    }

    const dealer = await DealerProfile.findById(dealerId)
      .populate('user', 'name email role')
      .populate('moderation.by', 'name email');

    if (!dealer) {
      res.status(404).json({
        success: false,
        message: 'Dealer not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDealerStats = async (req, res) => {
  try {
    const [pending, approved, rejected, suspended, total] = await Promise.all([
      DealerProfile.countDocuments({ status: 'pending' }),
      DealerProfile.countDocuments({ status: 'approved' }),
      DealerProfile.countDocuments({ status: 'rejected' }),
      DealerProfile.countDocuments({ status: 'suspended' }),
      DealerProfile.countDocuments({}),
    ]);

    return res.status(200).json({
      success: true,
      data: { total, pending, approved, rejected, suspended },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDealerAuditFeed = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);

    const items = await DealerProfile.find({
      'moderation.at': { $exists: true },
    })
      .select('companyName status rejectionReason moderation updateAt')
      .populate('moderation.by', 'name email')
      .sort({ 'moderation.at': -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: limit.length,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalBuyers,
      totalDealers,
      pendingDealers,
      totalCars,
      publishedCars,
      totalBookings,
      pendingBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'dealer' }),
      DealerProfile.countDocuments({ status: 'pending' }),
      Car.countDocuments({}),
      Car.countDocuments({ isPublished: true }),
      Booking.countDocuments({}),
      Booking.countDocuments({ status: 'pending' }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          buyers: totalBuyers,
          dealers: totalDealers,
        },
        dealers: {
          pendingProfiles: pendingDealers,
        },
        cars: {
          total: totalCars,
          published: publishedCars,
          unpublished: totalCars - publishedCars,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllCarsAdmin = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '10', 10), 1),
      50,
    );
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.isPublished !== undefined) {
      filter.isPublished = req.query.isPublished === 'true';
    }

    const [totalCars, cars] = await Promise.all([
      Car.countDocuments(filter),
      Car.find(filter)
        .populate('dealer', 'name, email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,
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

exports.unpublishCarAdmin = async (req, res) => {
  try {
    const carId = req.params.id.trim();

    if (!mongoose.isValidObjectId(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Car not found',
      });
    }

    const updated = await Car.findOneAndUpdate(
      { _id: carId },
      { $set: { isPublished: false } },
      { new: true, runValidators: true },
    ).populate('dealer', 'name email');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car unpublished by admin',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllDealersAdmin = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '10', 10), 1),
      50,
    );
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [totalDealers, dealers] = await Promise.all([
      DealerProfile.countDocuments(filter),
      DealerProfile.find(filter)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        totalDealers,
        totalPages: Math.ceil(totalDealers / limit),
      },
      data: dealers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.approveBookingAdmin = async (req, res) => {
  try {
    const bookingId = req.params.id.trim();
    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking id',
      });
    }

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: { status: 'approved' } },
      { new: true, runValidators: true },
    )
      .populate('user', 'name email role')
      .populate('service', 'title price durationMinutes');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: ' Booking not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking approved',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.cancelBookingAdmin = async (req, res) => {
  try {
    const bookingId = req.params.id.trim();
    const reason =
      typeof req.body.reason === 'string' ? req.body.reason.trim() : '';

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking id',
      });
    }

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          status: 'cancelled',
          cancelReason: reason,
        },
      },
      { new: true, runValidators: true },
    )
      .populate('user', 'name email role')
      .populate('service', 'title price, durationMinutes');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 *Admin can get all bookings
 */

exports.getAllBookingsAdmin = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '10', 10), 1),
      50,
    );
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter)
        .populate('user', 'name email role')
        .populate('service', 'title price durationMinutes ')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        totalBookings: total,
        totalPages: Math.ceil(total / limit),
      },
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
