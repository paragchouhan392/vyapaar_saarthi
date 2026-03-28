const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please add a company name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  revenue: {
    type: Number,
    required: [true, 'Please add revenue'],
    default: 0
  },
  marketingBudget: {
    type: Number,
    default: 0
  },
  rndBudget: {
    type: Number,
    default: 0
  },
  investment: {
    type: Number,
    default: 0
  },
  debt: {
    type: Number,
    default: 0
  },
  operatingCost: {
    type: Number,
    default: 0
  },
  cashInHand: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
