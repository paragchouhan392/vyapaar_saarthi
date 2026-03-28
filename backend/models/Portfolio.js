const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  assetClass: {
    type: String,
    required: [true, 'Please specify the asset class'],
    enum: [
      'Stock',
      'Bond',
      'ETF',
      'Mutual Fund',
      'Government Securities',
      'Cryptocurrency',
      'Real Estate',
      'Commodity',
      'Others'
    ]
  },
  name: {
    type: String,
    required: [true, 'Please provide the asset name']
  },
  tickerSymbol: {
    type: String,
    default: ''
  },
  currentMarketPrice: {
    type: String,
    required: [true, 'Please provide the current market price']
  },
  allocatedAmount: {
    type: Number,
    required: [true, 'Please provide the allocated amount']
  },
  quantity: {
    type: Number,
    default: 0
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  returnPercentage: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  gainOrLoss: {
    type: Number,
    default: 0
  }
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  portfolioName: {
    type: String,
    required: [true, 'Please provide a portfolio name'],
    default: 'My Portfolio'
  },
  totalInvestedAmount: {
    type: Number,
    required: [true, 'Total invested amount is required'],
    default: 0
  },
  totalCurrentValue: {
    type: Number,
    default: 0
  },
  totalGainOrLoss: {
    type: Number,
    default: 0
  },
  overallReturnPercentage: {
    type: Number,
    default: 0
  },
  riskProfile: {
    type: String,
    enum: [
      'Very Conservative',
      'Conservative',
      'Moderate',
      'Aggressive',
      'Very Aggressive'
    ],
    default: 'Moderate'
  },
  rtdScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  items: [portfolioItemSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
portfolioSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
