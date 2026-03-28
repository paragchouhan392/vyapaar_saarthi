const express = require('express');
const { body } = require('express-validator');
const {
  createOrgProfile,
  getOrgProfile,
  updateOrgProfile,
} = require('../controllers/orgProfileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Shared validation rules (used for both POST and PUT)
const orgProfileValidation = [
  body('companyName').notEmpty().withMessage('Company name is required').trim(),
  body('industry').optional().trim(),
  body('companySize')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '200+', ''])
    .withMessage('Company size must be one of: 1-10, 11-50, 51-200, 200+'),
  body('location').optional().trim(),
  body('description').optional().trim(),
];

// POST /api/org-profile  — create
router.post('/', protect, orgProfileValidation, createOrgProfile);

// GET  /api/org-profile  — read
router.get('/', protect, getOrgProfile);

// PUT  /api/org-profile  — update (partial)
router.put('/', protect, orgProfileValidation, updateOrgProfile);

module.exports = router;
