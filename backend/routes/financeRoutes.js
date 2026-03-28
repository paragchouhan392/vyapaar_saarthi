const express = require('express');
const { body } = require('express-validator');
const { createFinance, getFinance } = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const financeValidation = [
  body('revenue').optional().isNumeric().withMessage('Revenue must be a number'),
  body('marketingBudget').optional().isNumeric().withMessage('Marketing budget must be a number'),
  body('rndBudget').optional().isNumeric().withMessage('R&D budget must be a number'),
  body('investment').optional().isNumeric().withMessage('Investment must be a number'),
  body('debt').optional().isNumeric().withMessage('Debt must be a number'),
  body('operatingCost').optional().isNumeric().withMessage('Operating cost must be a number'),
  body('cashInHand').optional().isNumeric().withMessage('Cash in hand must be a number'),
];

// POST /api/finance
router.post('/', protect, financeValidation, createFinance);

// GET /api/finance
router.get('/', protect, getFinance);

module.exports = router;
