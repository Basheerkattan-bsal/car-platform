const mongoose = require('mongoose');

const dealerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    moderation: {
      lastAction: {
        type: String,
        enum: ['approved', 'rejected', 'suspend', 'reactivated'],
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      at: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DealerProfile', dealerProfileSchema);
