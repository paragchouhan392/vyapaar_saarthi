const Portfolio = require('../models/Portfolio');

// @desc    Get all portfolios for a user
// @route   GET /api/portfolio
// @access  Private
const getAllPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!portfolios || portfolios.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No portfolios found',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Portfolios retrieved successfully',
      data: portfolios
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single portfolio by ID
// @route   GET /api/portfolio/:id
// @access  Private
const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio not found');
    }

    if (portfolio.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this portfolio');
    }

    return res.status(200).json({
      success: true,
      message: 'Portfolio retrieved successfully',
      data: portfolio
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get portfolio summary/analytics
// @route   GET /api/portfolio/:id/summary
// @access  Private
const getPortfolioSummary = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      res.status(404);
      throw new Error('Portfolio not found');
    }

    if (portfolio.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access this portfolio');
    }

    const summary = {
      portfolioName: portfolio.portfolioName,
      riskProfile: portfolio.riskProfile,
      rtdScore: portfolio.rtdScore,
      totalInvestedAmount: portfolio.totalInvestedAmount,
      totalCurrentValue: portfolio.totalCurrentValue,
      totalGainOrLoss: portfolio.totalGainOrLoss,
      overallReturnPercentage: portfolio.overallReturnPercentage,
      itemCount: portfolio.items.length,
      breakdown: {
        byAssetClass: getAssetClassBreakdown(portfolio),
        topPerformers: getTopPerformers(portfolio),
        bottomPerformers: getBottomPerformers(portfolio)
      },
      lastUpdated: portfolio.updatedAt
    };

    return res.status(200).json({
      success: true,
      message: 'Portfolio summary retrieved successfully',
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get asset class breakdown
function getAssetClassBreakdown(portfolio) {
  const breakdown = {};

  portfolio.items.forEach((item) => {
    if (!breakdown[item.assetClass]) {
      breakdown[item.assetClass] = {
        count: 0,
        totalValue: 0,
        percentage: 0
      };
    }
    breakdown[item.assetClass].count += 1;
    breakdown[item.assetClass].totalValue += item.currentValue || item.allocatedAmount;
  });

  // Calculate percentages
  Object.keys(breakdown).forEach((key) => {
    breakdown[key].percentage = portfolio.totalCurrentValue > 0
      ? ((breakdown[key].totalValue / portfolio.totalCurrentValue) * 100).toFixed(2)
      : 0;
  });

  return breakdown;
}

// Helper function to get top performers
function getTopPerformers(portfolio) {
  return portfolio.items.slice()
    .sort((a, b) => (b.returnPercentage || 0) - (a.returnPercentage || 0))
    .slice(0, 3)
    .map((item) => ({
      name: item.name,
      returnPercentage: item.returnPercentage,
      gainOrLoss: item.gainOrLoss
    }));
}

// Helper function to get bottom performers
function getBottomPerformers(portfolio) {
  return portfolio.items.slice()
    .sort((a, b) => (a.returnPercentage || 0) - (b.returnPercentage || 0))
    .slice(0, 3)
    .map((item) => ({
      name: item.name,
      returnPercentage: item.returnPercentage,
      gainOrLoss: item.gainOrLoss
    }));
}

module.exports = {
  getAllPortfolios,
  getPortfolioById,
  getPortfolioSummary
};
