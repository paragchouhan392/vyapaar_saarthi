const FinancialData    = require('../models/FinancialData');
const { sendResponse } = require('../utils/sendResponse');
const { validationResult } = require('express-validator');

/**
 * @desc    Create or update financial data for the logged-in user
 * @route   POST /api/finance
 * @access  Private
 */
const createFinance = async (req, res, next) => {
  try {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const {
      revenue, marketingBudget, rndBudget,
      investment, debt, operatingCost, cashInHand,
    } = req.body;

    const finance = await FinancialData.create({
      userId: req.user._id,
      revenue:         revenue         || 0,
      marketingBudget: marketingBudget || 0,
      rndBudget:       rndBudget       || 0,
      investment:      investment      || 0,
      debt:            debt            || 0,
      operatingCost:   operatingCost   || 0,
      cashInHand:      cashInHand      || 0,
    });

    return sendResponse(res, 201, true, 'Financial data saved successfully', finance);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get latest financial data for the logged-in user
 * @route   GET /api/finance
 * @access  Private
 */
const getFinance = async (req, res, next) => {
  try {
    const finance = await FinancialData.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!finance) {
      return sendResponse(res, 404, false, 'No financial data found. Please add your financial details.');
    }

    return sendResponse(res, 200, true, 'Financial data fetched', finance);
  } catch (error) {
    next(error);
  }
};

module.exports = { createFinance, getFinance };
