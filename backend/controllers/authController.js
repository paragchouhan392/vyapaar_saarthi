const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const signup = async (req, res, next) => {
  try {
    const {
      companyName, email, password,
      revenue, marketingBudget, rndBudget,
      investment, debt, operatingCost, cashInHand
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      companyName,
      email,
      password: hashedPassword,
      revenue,
      marketingBudget: marketingBudget || 0,
      rndBudget: rndBudget || 0,
      investment: investment || 0,
      debt: debt || 0,
      operatingCost: operatingCost || 0,
      cashInHand: cashInHand || 0
    });

    if (user) {
      const userData = user.toObject();
      delete userData.password;

      res.status(201).json({
        success: true,
        message: 'User registered successfully with complete profile',
        data: {
          ...userData,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(400);
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400);
      throw new Error('Invalid credentials');
    }

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        _id: user.id,
        companyName: user.companyName,
        email: user.email,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
