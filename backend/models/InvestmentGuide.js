const mongoose = require('mongoose');

/**
 * InvestmentGuide Model
 * Stores AI-generated investment recommendations per user.
 */
const investmentGuideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation text is required'],
      trim: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: [true, 'Risk level is required'],
    },
    suggestedAllocation: {
      // e.g. { stocks: 40, bonds: 30, crypto: 10, cash: 20 }
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InvestmentGuide', investmentGuideSchema);
