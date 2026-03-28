const mongoose = require('mongoose');

/**
 * BalanceSheet Model
 * Stores a snapshot of company's financial position.
 */
const balanceSheetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    assets: {
      type: Number,
      required: [true, 'Total assets are required'],
      min: [0, 'Assets cannot be negative'],
    },
    liabilities: {
      type: Number,
      required: [true, 'Total liabilities are required'],
      min: [0, 'Liabilities cannot be negative'],
    },
    equity: {
      type: Number,
      default: 0,  // auto-calculated: assets - liabilities
    },
  },
  { timestamps: true }
);

// Auto-calculate equity before save
balanceSheetSchema.pre('save', function (next) {
  this.equity = this.assets - this.liabilities;
  next();
});

module.exports = mongoose.model('BalanceSheet', balanceSheetSchema);
