const OrgProfile       = require('../models/OrgProfile');
const { sendResponse } = require('../utils/sendResponse');
const { validationResult } = require('express-validator');

/**
 * @desc    Create organisation profile
 * @route   POST /api/org-profile
 * @access  Private
 */
const createOrgProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const existing = await OrgProfile.findOne({ userId: req.user._id });
    if (existing) {
      return sendResponse(res, 400, false, 'Profile already exists. Use PUT to update it.');
    }

    const { companyName, industry, companySize, location, description } = req.body;

    const profile = await OrgProfile.create({
      userId: req.user._id,
      companyName,
      industry:    industry    || '',
      companySize: companySize || '',
      location:    location    || '',
      description: description || '',
    });

    return sendResponse(res, 201, true, 'Organisation profile created', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get organisation profile
 * @route   GET /api/org-profile
 * @access  Private
 */
const getOrgProfile = async (req, res, next) => {
  try {
    const profile = await OrgProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return sendResponse(res, 404, false, 'Organisation profile not found');
    }

    return sendResponse(res, 200, true, 'Organisation profile fetched', profile);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update organisation profile
 * @route   PUT /api/org-profile
 * @access  Private
 */
const updateOrgProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const allowedFields = ['companyName', 'industry', 'companySize', 'location', 'description'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const profile = await OrgProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return sendResponse(res, 404, false, 'Organisation profile not found. Create one first with POST.');
    }

    return sendResponse(res, 200, true, 'Organisation profile updated', profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrgProfile, getOrgProfile, updateOrgProfile };
