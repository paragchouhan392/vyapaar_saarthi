const express = require('express');
const { body } = require('express-validator');
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/dashboard
router.get('/', protect, getDashboard);

module.exports = router;
