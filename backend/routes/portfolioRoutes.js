const express = require('express');
const router = express.Router();
const {
  getAllPortfolios,
  getPortfolioById,
  getPortfolioSummary
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(protect);

// Portfolio VIEW only operations
router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);
router.get('/:id/summary', getPortfolioSummary);

module.exports = router;
