const Car = require('../models/Car');

exports.checkCarOwnerShip = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    //Admin override
    if (req.user.role === 'admin') {
      req.car = car;
      return next();
    }

    // OwnerShipCheck

    if (car.dealer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'Not authorized to modify this car' });
    }

    // Controller reuse
    req.car = car;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
