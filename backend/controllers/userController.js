const User = require('../models/User');

// @desc    Get user profile including financial data
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update financial data
// @route   PUT /api/user/update-finance
// @access  Private
const updateFinance = async (req, res, next) => {
  try {
    const {
      revenue, marketingBudget, rndBudget,
      investment, debt, operatingCost, cashInHand
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields if provided
    if (revenue !== undefined) user.revenue = revenue;
    if (marketingBudget !== undefined) user.marketingBudget = marketingBudget;
    if (rndBudget !== undefined) user.rndBudget = rndBudget;
    if (investment !== undefined) user.investment = investment;
    if (debt !== undefined) user.debt = debt;
    if (operatingCost !== undefined) user.operatingCost = operatingCost;
    if (cashInHand !== undefined) user.cashInHand = cashInHand;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Financial data updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateFinance
};
