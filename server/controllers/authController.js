const User = require('../models/User');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { signToken, cookieOptions } = require('../utils/jwt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user exists:
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User is already signed up' });
    }

    const accountRole = role === 'dealer' ? 'dealer' : 'buyer';

    /*  // Hash password:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); */

    // Create user:
    const user = await User.create({
      name,
      password,
      email,
      role: accountRole,
    });

    const token = signToken({ id: user._id.toString(), role: user.role });
    res.cookie('access_token', token, cookieOptions());

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ? This is (Token in json version of signing in)

//? This is the (cookie version of signing in )

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const ok = await user.comparePassword(password);

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = signToken({ id: user._id.toString(), role: user.role });

    res.cookie('access_token', token, cookieOptions());

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

exports.logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
