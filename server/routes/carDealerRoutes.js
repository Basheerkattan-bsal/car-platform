const express = require('express');
const router = express.Router();

const {
  getMyCars,
  createCar,
  updateMyCar,
  deleteMyCar,
  publishMyCar,
  unpublishMyCar,
  uploadMyCarImages,
  deleteMyCarImage,
  setCarMainImage,
} = require('../controllers/carController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { checkCarOwnerShip } = require('../middleware/ownerShipMiddleware');
const { uploadCarImages } = require('../middleware/uploadMiddleware');

/*
=================================
DEALER ROUTES
Base: /api/dealer/cars
=================================
*/

// Apply auth with out repeating in every route!!
router.use(protect);
router.use(authorize('dealer'));

// GET /api/dealer/cars/my
router.get('/my', getMyCars);

// POST /api/dealer/cars
router.post('/', createCar);

// PUT /api/dealer/cars/:id/publish
router.put('/:id/publish', checkCarOwnerShip, publishMyCar);
// PUT /api/dealer/cars/:id/unpublish

router.put('/:id/unpublish', checkCarOwnerShip, unpublishMyCar);
// PUT /api/dealer/cars/:id/main-image

router.put('/:id/main-image', checkCarOwnerShip, setCarMainImage);
// DELETE /api/dealer/cars/:id/images

router.delete('/:id/images', checkCarOwnerShip, deleteMyCarImage);

// PUT /api/dealer/cars/:id
router.put('/:id', checkCarOwnerShip, updateMyCar);

// DELETE /api/dealer/cars/:id
router.delete('/:id', checkCarOwnerShip, deleteMyCar);

// POST /api/dealer/cars/:id/images
router.post(
  '/:id/images',
  checkCarOwnerShip,
  uploadCarImages,
  uploadMyCarImages
);

module.exports = router;
