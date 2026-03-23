const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token is required.', 401, 'AUTH_REQUIRED');
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Access token expired.', 401, 'TOKEN_EXPIRED');
    }

    throw new AppError('Access token is invalid.', 401, 'INVALID_TOKEN');
  }

  const user = await User.findById(decoded.sub).select('_id name email');

  if (!user) {
    throw new AppError('User no longer exists.', 401, 'USER_NOT_FOUND');
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  next();
});

module.exports = protect;
