const express = require('express');
const router = express.Router();
const { financialSuggestions, analyzeFinancials } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/financial-suggestions', financialSuggestions);
router.post('/analyze', protect, analyzeFinancials);

module.exports = router;
