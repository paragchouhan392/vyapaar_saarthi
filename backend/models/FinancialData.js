const mongoose = require('mongoose');

/**
 * FinancialData Model
 * Stores financial metrics per user (separate from auth User model).
 */
const financialDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    revenue: {
      type: Number,
      default: 0,
    },
    marketingBudget: {
      type: Number,
      default: 0,
    },
    rndBudget: {
      type: Number,
      default: 0,
    },
    investment: {
      type: Number,
      default: 0,
    },
    debt: {
      type: Number,
      default: 0,
    },
    operatingCost: {
      type: Number,
      default: 0,
    },
    cashInHand: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FinancialData', financialDataSchema);
