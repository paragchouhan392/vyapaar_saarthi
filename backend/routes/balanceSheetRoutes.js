const express = require('express');
const { body } = require('express-validator');
const { addBalanceSheet, getBalanceSheet } = require('../controllers/balanceSheetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const balanceSheetValidation = [
  body('assets')
    .isFloat({ min: 0 })
    .withMessage('Assets must be a non-negative number'),
  body('liabilities')
    .isFloat({ min: 0 })
    .withMessage('Liabilities must be a non-negative number'),
];

// POST /api/balance
router.post('/', protect, balanceSheetValidation, addBalanceSheet);

// GET  /api/balance?page=1&limit=10
router.get('/', protect, getBalanceSheet);

module.exports = router;
