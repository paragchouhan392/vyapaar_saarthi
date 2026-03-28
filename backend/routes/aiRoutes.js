const express = require('express');
const router = express.Router();
const { testGemini, analyzeFinancials } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/test-gemini', testGemini);
router.post('/analyze', protect, analyzeFinancials);

module.exports = router;
