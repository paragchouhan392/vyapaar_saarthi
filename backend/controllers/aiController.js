const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// @desc    Get AI-powered financial investment suggestions
// @route   POST /api/ai/financial-suggestions
// @access  Public
const financialSuggestions = async (req, res, next) => {
  try {
    const { amount, rtdScore } = req.body;

    // Validate input
    if (!amount || rtdScore === undefined || rtdScore === null) {
      res.status(400);
      throw new Error('Please provide both amount and rtdScore');
    }

    if (amount <= 0) {
      res.status(400);
      throw new Error('Amount must be greater than 0');
    }

    if (rtdScore < 1 || rtdScore > 10) {
      res.status(400);
      throw new Error('RTD Score must be between 1 and 10');
    }

    console.log('Generating investment suggestions for amount:', amount, 'RTD Score:', rtdScore);

    // Determine risk profile based on RTD score
    const getRiskProfile = (score) => {
      if (score <= 2) return 'Very Conservative';
      if (score <= 4) return 'Conservative';
      if (score <= 6) return 'Moderate';
      if (score <= 8) return 'Aggressive';
      return 'Very Aggressive';
    };

    const riskProfile = getRiskProfile(rtdScore);

    // Create a detailed prompt for Gemini
    const investmentPrompt = `You are a professional financial advisor specializing in Indian investments. Based on the following criteria, provide detailed investment suggestions for the Indian market.

Investment Details:
- Amount to Invest: ₹${amount} (Indian Rupees)
- Risk Tolerance Score: ${rtdScore}/10 (${riskProfile})
- Market: India

Please provide 3-5 specific investment recommendations from the Indian market in the following JSON format. Be specific with Indian stock names, ticker symbols (e.g., BSE, NSE codes), bond types, ETFs listed on Indian exchanges, or other investment vehicles available in India. Include the current market price for each instrument:

{
  "riskProfile": "${riskProfile}",
  "recommendations": [
    {
      "assetClass": "Stock/Bond/ETF/Mutual Fund/Government Securities/etc",
      "name": "Specific investment name with ticker symbol (BSE/NSE)",
      "currentMarketPrice": "Current price in INR (e.g., ₹1,234.50)",
      "priceAsOf": "Date/time of price",
      "allocation": "X% of the investment amount",
      "allocatedAmount": "Rupee amount for this investment",
      "reason": "Why this investment suits the profile and amount in Indian context",
      "expectedReturn": "Expected return range",
      "riskLevel": "Low/Medium/High"
    }
  ],
  "summary": "Overall investment strategy summary for Indian markets",
  "diversificationTips": "Tips for diversification with this amount in Indian market",
  "indianMarketNotes": "Specific insights about the Indian market conditions",
  "lastUpdated": "Current date and time of market data"
}

IMPORTANT: 
- Include the current market price for each instrument
- Include the date/time the price is from
- Calculate and show the allocated amount in rupees for each recommendation
- Ensure the total allocation adds up to 100%
- Make recommendations that match the risk tolerance score and are suitable for Indian investors
- Consider Indian stocks (BSE/NSE), bonds, mutual funds registered with SEBI, and government securities`;

    try {
      const result = await model.generateContent(investmentPrompt);
      const response = result.response;
      const text = response.text();

      // Try to parse the JSON response from Gemini
      let suggestions;
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, return the raw text in a structured format
          suggestions = {
            riskProfile: riskProfile,
            recommendations: [],
            summary: text,
            rawResponse: text
          };
        }
      } catch (parseError) {
        // If JSON parsing fails, return structured response with raw text
        suggestions = {
          riskProfile: riskProfile,
          recommendations: [],
          summary: text,
          rawResponse: text
        };
      }

      return res.status(200).json({
        success: true,
        message: 'Investment suggestions generated successfully',
        data: {
          investmentAmount: amount,
          rtdScore: rtdScore,
          riskProfile: riskProfile,
          suggestions: suggestions
        }
      });
    } catch (geminiError) {
      console.error('Gemini API Error Details:', {
        message: geminiError.message,
        status: geminiError.status,
        statusText: geminiError.statusText
      });
      throw geminiError;
    }
  } catch (error) {
    console.error('Financial Suggestions Error:', error.message);
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
  financialSuggestions,
  analyzeFinancials
};
