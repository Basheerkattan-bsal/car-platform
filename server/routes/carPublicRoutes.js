const express = require('express');
const router = express.Router();

const {
  getCarsPublic,
  getCarByIdPublic,
  getCarBrandsPublic,
} = require('../controllers/carController');

router.get('/', getCarsPublic);
router.get('/meta/brands', getCarBrandsPublic);
router.get('/:id', getCarByIdPublic);

module.exports = router;
