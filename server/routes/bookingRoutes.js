const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  approveBooking,
  cancelBooking,
  getAllBookingsAdmin,
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { authorize } = require('../middleware/roleMiddleware');
const { createBookingSchema } = require('../validations/booking.validation');

router.post(
  '/',
  protect,
  authorize('buyer', 'dealer'),
  validate(createBookingSchema),
  createBooking
);
router.get('/me', protect, authorize('buyer'), getMyBookings);
module.exports = router;
