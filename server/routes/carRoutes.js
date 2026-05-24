const express = require('express');
const router = express.Router();

const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getMyCars,
  /*   getCarsPublic,
  getCarByIdPublic, */
  publishMyCar,
  unpublishMyCar,
  updateMyCar,
  deleteMyCar,
  uploadMyCarImages,
  deleteMyCarImage,
  setCarMainImage,
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { checkCarOwnerShip } = require('../middleware/ownerShipMiddleware');
const { uploadCarImages } = require('../middleware/uploadMiddleware');

router.get('/', getCars);
router.get('/my', protect, authorize('dealer'), getMyCars);
router.get('/:id', getCar);
router.post('/', protect, authorize('dealer', 'admin'), createCar);
router.post(
  '/:id/images',
  protect,
  authorize('dealer'),
  uploadCarImages,
  uploadMyCarImages
);

router.put('/:id/publish', protect, authorize('dealer'), publishMyCar);
router.put('/:id/unpublish', protect, authorize('dealer'), unpublishMyCar);
router.put('/:id', protect, authorize('dealer'), updateMyCar);
router.put('/:id/main-image', protect, authorize('dealer'), setCarMainImage);
router.delete('/:id', protect, authorize('dealer'), deleteMyCar);

router.delete('/:id/images', protect, authorize('dealer'), deleteMyCarImage);
module.exports = router;
