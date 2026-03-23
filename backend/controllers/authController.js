const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const {
  createTokenPair,
  getRefreshTokenExpiry,
  hashToken,
  sanitizeUser
} = require('../utils/tokens');

const MAX_ACTIVE_SESSIONS = 5;

const issueTokensForUser = async (user) => {
  const { accessToken, refreshToken, tokenId } = createTokenPair(user.id);

  user.refreshTokens = (user.refreshTokens || [])
    .filter((token) => token.expiresAt > new Date())
    .slice(-(MAX_ACTIVE_SESSIONS - 1));

  user.refreshTokens.push({
    tokenId,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(refreshToken)
  });

  await user.save();

  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_IN_USE');
  }

  const user = await User.create({ name, email, password });
  const tokens = await issueTokensForUser(user);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: {
      user: sanitizeUser(user),
      ...tokens
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshTokens');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  const tokens = await issueTokensForUser(user);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    data: {
      user: sanitizeUser(user),
      ...tokens
    }
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError('Refresh token is invalid or expired.', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokens');

  if (!user) {
    throw new AppError('Refresh token is invalid.', 401, 'INVALID_REFRESH_TOKEN');
  }

  const tokenHash = hashToken(refreshToken);
  const storedTokenIndex = user.refreshTokens.findIndex(
    (token) => token.tokenId === decoded.jti && token.tokenHash === tokenHash
  );

  if (storedTokenIndex === -1) {
    user.refreshTokens = [];
    await user.save();

    throw new AppError(
      'Refresh token reuse detected. Please log in again.',
      401,
      'TOKEN_REUSE_DETECTED'
    );
  }

  user.refreshTokens.splice(storedTokenIndex, 1);
  const { accessToken, refreshToken: nextRefreshToken, tokenId } = createTokenPair(user.id);

  user.refreshTokens.push({
    tokenId,
    tokenHash: hashToken(nextRefreshToken),
    expiresAt: getRefreshTokenExpiry(nextRefreshToken)
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Tokens refreshed successfully.',
    data: {
      accessToken,
      refreshToken: nextRefreshToken
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    let decoded = null;

    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (_error) {
      decoded = jwt.decode(refreshToken);
    }

    if (decoded?.sub) {
      const user = await User.findById(decoded.sub).select('+refreshTokens');

      if (user) {
        const tokenHash = hashToken(refreshToken);
        user.refreshTokens = user.refreshTokens.filter((token) => token.tokenHash !== tokenHash);
        await user.save();
      }
    }
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('User no longer exists.', 401, 'USER_NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(user)
    }
  });
});

module.exports = {
  getMe,
  login,
  logout,
  refresh,
  register
};
