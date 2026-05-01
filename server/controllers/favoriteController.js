const mongoose = require('mongoose');

const User = require('../models/User');
const Car = require('../models/Car');

exports.toggleFavorites = async (req, res) => {
  try {
    const { carId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid car id',
      });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!Array.isArray(user.favorites)) {
      user.favorites = [];
    }

    const alreadyFavorite = user.favorites.some(
      favId => favId.toString() === carId
    );

    if (alreadyFavorite) {
      user.favorites = user.favorites.filter(
        favId => favId.toString() !== carId
      );
    } else {
      user.favorites.push(car._id);
    }
    await user.save();

    return res.status(200).json({
      success: true,
      isFavorite: !alreadyFavorite,
      favoritesCount: user.favorites.length,
      message: alreadyFavorite
        ? 'Car removed from favorites'
        : 'Car added to favorites',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
