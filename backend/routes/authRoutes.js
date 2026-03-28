const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: errors.array()
    });
  }
  next();
};

router.post(
  '/signup',
  [
    check('companyName', 'Company name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('revenue', 'Revenue is required and must be a number').isNumeric()
  ],
  validateResult,
  signup
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  validateResult,
  login
);

module.exports = router;
