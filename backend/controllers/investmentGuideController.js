const InvestmentGuide  = require('../models/InvestmentGuide');
const { sendResponse } = require('../utils/sendResponse');
const { paginateQuery } = require('../utils/paginate');
const { validationResult } = require('express-validator');

/**
 * @desc    Save a new investment guide / AI recommendation
 * @route   POST /api/investment-guide
 * @access  Private
 */
const createInvestmentGuide = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { recommendation, riskLevel, suggestedAllocation } = req.body;

    const guide = await InvestmentGuide.create({
      userId: req.user._id,
      recommendation,
      riskLevel,
      suggestedAllocation: suggestedAllocation || {},
    });

    return sendResponse(res, 201, true, 'Investment guide saved', guide);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get investment guide history (with pagination)
 * @route   GET /api/investment-guide?page=1&limit=10
 * @access  Private
 */
const getInvestmentGuides = async (req, res, next) => {
  try {
    const { docs: guides, pagination } = await paginateQuery(
      InvestmentGuide,
      { userId: req.user._id },
      req.query
    );

    return sendResponse(res, 200, true, 'Investment guides fetched', { guides, pagination });
  } catch (error) {
    next(error);
  }
};

module.exports = { createInvestmentGuide, getInvestmentGuides };
