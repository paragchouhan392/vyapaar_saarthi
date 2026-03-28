const express = require('express');
const router = express.Router();
const { analyzeFinancials } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeFinancials);

module.exports = router;
