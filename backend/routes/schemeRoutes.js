const express = require('express');
const router = express.Router();
const {
  getGovernmentSchemes,
  getAllSchemes,
  getSchemesById,
  getSchemesByBusinessType
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(protect);

// Scheme operations
router.post('/get-schemes', getGovernmentSchemes);
router.get('/', getAllSchemes);
router.get('/:id', getSchemesById);
router.get('/search/:businessType', getSchemesByBusinessType);

module.exports = router;
