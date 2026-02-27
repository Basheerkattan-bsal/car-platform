const mongoose = require('mongoose');
const { boolean } = require('zod');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxLength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
      max: 600,
    },
    isActive: {
      type: boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
