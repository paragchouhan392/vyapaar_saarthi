const express = require('express');
const router = express.Router();
const { testGemini, analyzeFinancials, getBusinessAssistantRecommendations } = require('../controllers/mlController');
const { protect } = require('../middleware/authMiddleware');

router.post('/test-gemini', testGemini);
router.post('/analyze', protect, analyzeFinancials);
router.post('/business-assistant', protect, getBusinessAssistantRecommendations);

module.exports = router;
