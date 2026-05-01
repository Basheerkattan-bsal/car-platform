const express = require('express');
const router = express.Router();

const {
  getAllDealers,
  approveDealer,
  rejectDealer,
  suspendDealer,
  reactivateDealer,
  getDealerById,
  getDealerStats,
  getAdminStats,
  getAllCarsAdmin,
  unpublishCarAdmin,
  getAllDealersAdmin,
  getAllBookingsAdmin,
  approveBookingAdmin,
  cancelBookingAdmin,
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/dealers', protect, authorize('admin'), getAllDealers);
router.get('/dealers/:id', protect, authorize('admin'), getDealerById);
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/dealers', protect, authorize('admin'), getAllDealersAdmin);
router.get('/stats/dealers', protect, authorize('admin'), getDealerStats);
router.get('/cars', protect, authorize('admin'), getAllCarsAdmin);
router.get('/bookings', protect, authorize('admin'), getAllBookingsAdmin);
router.put(
  '/bookings/:id/approve',
  protect,
  authorize('admin'),
  approveBookingAdmin
);
router.put(
  '/bookings/:id/cancel',
  protect,
  authorize('admin'),
  cancelBookingAdmin
);
router.put('/dealers/approve/:id', protect, authorize('admin'), approveDealer);
router.put('/dealers/reject/:id', protect, authorize('admin'), rejectDealer);
router.put('/dealers/suspend/:id', protect, authorize('admin'), suspendDealer);
router.put(
  '/dealers/reactivate/:id',
  protect,
  authorize('admin'),
  reactivateDealer
);
router.put(
  '/cars/:id/unpublish',
  protect,
  authorize('admin'),
  unpublishCarAdmin
);

module.exports = router;
