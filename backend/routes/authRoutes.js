const express = require('express');

const { getMe, login, logout, refresh, register } = require('../controllers/authController');
const protect = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validate');
const {
  loginValidation,
  logoutValidation,
  refreshValidation,
  registerValidation
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/refresh', refreshValidation, handleValidationErrors, refresh);
router.post('/logout', logoutValidation, handleValidationErrors, logout);
router.get('/me', protect, getMe);

module.exports = router;
