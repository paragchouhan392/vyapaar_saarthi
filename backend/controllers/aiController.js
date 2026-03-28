const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// @desc    Test Gemini API
// @route   POST /api/ai/test-gemini
// @access  Public
const testGemini = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400);
      throw new Error('Please provide a prompt to test');
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({
      success: true,
      message: 'Gemini API test successful',
      prompt: prompt,
      response: text
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze financial data via AI service
// @route   POST /api/ai/analyze
// @access  Private
const analyzeFinancials = async (req, res, next) => {
  try {
    // Fetch latest user info including financials
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Extract finance fields directly from user object
    const dataToAnalyze = {
      revenue: user.revenue,
      marketingBudget: user.marketingBudget,
      rndBudget: user.rndBudget,
      investment: user.investment,
      debt: user.debt,
      operatingCost: user.operatingCost,
      cashInHand: user.cashInHand
    };

    // The AI service URL
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/predict';

    try {
      const response = await axios.post(aiServiceUrl, dataToAnalyze);
      
      return res.status(200).json({
        success: true,
        message: 'AI Analysis completed successfully',
        data: response.data
      });
    } catch (aiError) {
      console.error('AI Service Error:', aiError.message);
      res.status(502); // Bad Gateway
      throw new Error('Failed to connect to AI analysis service');
    }
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  testGemini,
  analyzeFinancials
};
