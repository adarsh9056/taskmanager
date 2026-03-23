const { validationResult } = require('express-validator');

const AppError = require('../utils/appError');

const handleValidationErrors = (req, _res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  next(
    new AppError(
      'Validation failed.',
      400,
      'VALIDATION_ERROR',
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    )
  );
};

module.exports = handleValidationErrors;
