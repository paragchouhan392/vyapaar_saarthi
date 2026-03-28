const FinancialData = require('../models/FinancialData');
const Portfolio     = require('../models/Portfolio');
const BalanceSheet  = require('../models/BalanceSheet');
const { sendResponse } = require('../utils/sendResponse');

/**
 * @desc    Get dashboard summary (finance + portfolio + balance sheet)
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run all 3 queries in parallel for speed
    const [finance, portfolioItems, balanceSheet] = await Promise.all([
      FinancialData.findOne({ userId }).sort({ createdAt: -1 }),
      Portfolio.find({ userId }),
      BalanceSheet.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

    // Portfolio summary
    const totalInvested    = portfolioItems.reduce((s, p) => s + p.amountInvested, 0);
    const totalCurrentVal  = portfolioItems.reduce((s, p) => s + p.currentValue, 0);
    const totalReturns     = totalCurrentVal - totalInvested;

    const data = {
      financialSummary: finance || null,
      portfolioSummary: {
        totalAssets:      portfolioItems.length,
        totalInvested,
        totalCurrentValue: totalCurrentVal,
        totalReturns,
      },
      balanceSheet: balanceSheet || null,
    };

    return sendResponse(res, 200, true, 'Dashboard data fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
