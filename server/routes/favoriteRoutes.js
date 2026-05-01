const express = require('express');

const {
  toggleFavorites,
  getMyFavorites,
} = require('../controllers/favoriteController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMyFavorites);
router.post('/:carId', protect, toggleFavorites);

module.exports = router;
