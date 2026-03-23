const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const createTokenPair = (userId) => {
  const tokenId = crypto.randomUUID();

  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });

  const refreshToken = jwt.sign(
    {
      sub: userId,
      jti: tokenId,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
  );

  return {
    accessToken,
    refreshToken,
    tokenId
  };
};

const getRefreshTokenExpiry = (refreshToken) => {
  const decoded = jwt.decode(refreshToken);
  return new Date(decoded.exp * 1000);
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

module.exports = {
  createTokenPair,
  getRefreshTokenExpiry,
  hashToken,
  sanitizeUser
};
