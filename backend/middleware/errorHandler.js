const AppError = require('../utils/appError');

const normalizeError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error.message === 'Origin is not allowed by CORS.') {
    return new AppError(error.message, 403, 'CORS_BLOCKED');
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new AppError(`${field} already exists.`, 409, 'DUPLICATE_KEY');
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));

    return new AppError('Validation failed.', 400, 'VALIDATION_ERROR', details);
  }

  if (error.name === 'CastError') {
    return new AppError('Resource ID is invalid.', 400, 'INVALID_ID');
  }

  return new AppError(
    error.message || 'Internal server error.',
    error.statusCode || 500,
    error.code || 'INTERNAL_SERVER_ERROR',
    error.details
  );
};

const errorHandler = (error, _req, res, _next) => {
  const normalizedError = normalizeError(error);

  res.status(normalizedError.statusCode).json({
    success: false,
    message: normalizedError.message,
    code: normalizedError.code,
    errors: normalizedError.details || [],
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};

module.exports = errorHandler;
