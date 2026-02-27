const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    scheduledAt: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled', 'completed'],
      default: 'pending',
    },
    note: {
      type: String,
      trim: true,
      maxLength: 300,
      default: '',
    },
    cancelReason: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
