const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please use a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    favorites: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
      default: [],
    },

    role: {
      type: String,
      enum: {
        values: ['admin', 'dealer', 'buyer'],
        message: '{VALUE} is not a valid role',
      },
      default: 'buyer',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  // Only hash if the password is created/changed
  if (!this.isModified('password')) return;

  const slat = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
