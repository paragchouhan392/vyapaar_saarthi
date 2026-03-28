const BalanceSheet     = require('../models/BalanceSheet');
const { sendResponse } = require('../utils/sendResponse');
const { paginateQuery } = require('../utils/paginate');
const { validationResult } = require('express-validator');

/**
 * @desc    Add a balance sheet entry
 * @route   POST /api/balance
 * @access  Private
 */
const addBalanceSheet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { assets, liabilities } = req.body;

    const entry = await BalanceSheet.create({
      userId: req.user._id,
      assets,
      liabilities,
      // equity auto-calculated in pre-save hook
    });

    return sendResponse(res, 201, true, 'Balance sheet entry added', entry);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get balance sheet history (with pagination)
 * @route   GET /api/balance?page=1&limit=10
 * @access  Private
 */
const getBalanceSheet = async (req, res, next) => {
  try {
    const { docs: entries, pagination } = await paginateQuery(
      BalanceSheet,
      { userId: req.user._id },
      req.query
    );

    return sendResponse(res, 200, true, 'Balance sheet fetched', { entries, pagination });
  } catch (error) {
    next(error);
  }
};

module.exports = { addBalanceSheet, getBalanceSheet };
