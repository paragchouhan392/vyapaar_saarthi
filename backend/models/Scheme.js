const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  businessDescription: {
    type: String,
    required: [true, 'Please provide a business description'],
    maxlength: 1000
  },
  schemes: [
    {
      schemeName: {
        type: String,
        required: [true, 'Scheme name is required']
      },
      benefits: {
        type: String,
        required: [true, 'Scheme benefits are required']
      },
      schemeLink: {
        type: String,
        required: [true, 'Scheme link is required']
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  generatedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
schemeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Scheme', schemeSchema);
