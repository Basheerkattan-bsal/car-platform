const mongoose = require('mongoose');
const { boolean } = require('zod');

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    owner: {
      type: String,
      enum: ['Private', 'Dealer'],
      default: 'Dealer',
      required: true,
    },
    condition: {
      type: String,
      enum: ['Smoker', 'NON-Smoker'],
      default: 'Smoker',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId, // This will put the id of the dealer
      ref: 'User', // Important for populate()
      required: true,
    },
    isPublished: {
      type: boolean,
      require: true,
    },
    images: {
      type: ['String'],
      default: [],
    },
    mainImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
