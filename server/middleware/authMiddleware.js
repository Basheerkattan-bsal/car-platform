const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new AppError('Not authorized', 401);
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Not authorized, 401');
  }

  const user = await User.findById(decoded.id).select('_id name email role');

  if (!user) {
    throw new AppError('Not authorized', 401);
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return next();
});

/* exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
    console.log('AUTH HEADER', req.headers.authorization);
  }
};
 */

/* exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('_id name email role');
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized' });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};
 */
