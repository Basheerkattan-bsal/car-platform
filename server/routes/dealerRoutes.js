const express = require('express');
const router = express.Router();

const {
  createDealerProfile,
  getMyProfile,
  updateMyProfile,
  getMyStats,
  getMyCarsPaginated,
} = require('../controllers/dealerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { dealerApproved } = require('../middleware/dealerApproved');

router.post('/profile', protect, authorize('dealer'), createDealerProfile);
router.get('/me/stats', protect, authorize('dealer'), getMyStats);
router.get('/me/cars', protect, authorize('dealer'), getMyCarsPaginated);
router.get('/me', protect, authorize('dealer'), getMyProfile);
router.put('/approves/:id', protect, authorize('admin'), dealerApproved);
router.put('/me', protect, authorize('dealer'), updateMyProfile);
module.exports = router;
