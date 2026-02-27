const express = require('express');
const router = express.Router();

const {
  getServicePublic,
  createService,
} = require('../controllers/serviceController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
router.get('/', getServicePublic);
router.post('/', protect, authorize('admin'), createService);
module.exports = router;
