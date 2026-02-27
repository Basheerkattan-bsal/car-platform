const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledAt, note } = req.body;

    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid serviceId',
      });
    }

    const service = await Service.findById(serviceId).select('isActive');

    if (!service || service.isActive !== true) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive',
      });
    }

    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'scheduledAt must be a valid date',
      });
    }

    if (date.getTime() <= Date.now()) {
      return res.status(404).json({
        success: false,
        message: 'scheduledAt must be in the future',
      });
    }

    const created = await Booking.create({
      user: req.user.id,
      service: serviceId,
      scheduledAt: date,
      note: typeof note === 'string' ? note.trim() : '',
    });

    return res.status(201).json({
      success: true,
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Buyer can get his booking

exports.getMyBookings = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || '10', 10), 1),
      50
    );
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [total, bookings] = await Promise.all([
      Booking.countDocuments(filter),
      Booking.find(filter)
        .populate('service', 'title price durationMinutes isActive')
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

/**
 * Admin
 * Admin can approve, cancel bookings
 */
