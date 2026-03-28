const express = require('express');
const { body } = require('express-validator');
const {
  createInvestmentGuide,
  getInvestmentGuides,
} = require('../controllers/investmentGuideController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const guideValidation = [
  body('recommendation').notEmpty().withMessage('Recommendation text is required').trim(),
  body('riskLevel')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Risk level must be Low, Medium, or High'),
  body('suggestedAllocation')
    .optional()
    .isObject()
    .withMessage('Suggested allocation must be an object'),
];

// POST /api/investment-guide
router.post('/', protect, guideValidation, createInvestmentGuide);

// GET  /api/investment-guide?page=1&limit=10
router.get('/', protect, getInvestmentGuides);

module.exports = router;
