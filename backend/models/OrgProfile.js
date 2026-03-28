const mongoose = require('mongoose');

/**
 * OrgProfile Model
 * Stores detailed organisation/company profile per user.
 */
const orgProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,   // one profile per user
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      default: '',
    },
    companySize: {
      // e.g. "1-10", "11-50", "51-200", "200+"
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrgProfile', orgProfileSchema);
