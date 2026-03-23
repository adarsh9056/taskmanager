const { body } = require('express-validator');

const passwordRules = body('password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .withMessage('Password must include uppercase, lowercase, and a number.');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  passwordRules
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password').trim().notEmpty().withMessage('Password is required.')
];

const refreshValidation = [
  body('refreshToken').trim().notEmpty().withMessage('Refresh token is required.')
];

const logoutValidation = [
  body('refreshToken').optional().isString().withMessage('Refresh token must be a string.')
];

module.exports = {
  loginValidation,
  logoutValidation,
  refreshValidation,
  registerValidation
};
