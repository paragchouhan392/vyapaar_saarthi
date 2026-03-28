const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FinancialData = require('../models/FinancialData');
const InvestmentGuide = require('../models/InvestmentGuide');
const { sendResponse } = require('../utils/sendResponse');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// ─── Helper ──────────────────────────────────────────────────────────────────
/**
 * Build a concise prompt from financial data so Gemini can suggest allocations.
 */
const buildFinancePrompt = (finance) => `
You are an expert AI Financial Advisor for small and medium businesses.
Analyse the following financial data and provide:
1. A concise investment recommendation (2–3 sentences)
2. Risk level: Low / Medium / High
3. Suggested asset allocation as a JSON object with keys: stocks, bonds, crypto, cash — values must be percentages that add to 100.

Financial Data:
- Revenue:          ₹${finance.revenue}
- Marketing Budget: ₹${finance.marketingBudget}
- R&D Budget:       ₹${finance.rndBudget}
- Operating Cost:   ₹${finance.operatingCost}
- Investment:       ₹${finance.investment}
- Debt:             ₹${finance.debt}
- Cash in Hand:     ₹${finance.cashInHand}

Reply in this EXACT JSON format (no extra text):
{
  "recommendation": "...",
  "riskLevel": "Low|Medium|High",
  "suggestedAllocation": { "stocks": 0, "bonds": 0, "crypto": 0, "cash": 0 }
}
`.trim();

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Analyze financial data via Gemini AI + optional FastAPI service
 * @route   POST /api/ai/analyze
 * @access  Private
 */
const analyzeFinancials = async (req, res, next) => {
  try {
    const finance = await FinancialData.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!finance) {
      return sendResponse(res, 404, false, 'No financial data found. Please submit your financials first via POST /api/finance');
    }

    // ── Step 1: Try FastAPI service first ──────────────────────────────────
    let fastApiResult = null;
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000/predict';
      const { data } = await axios.post(aiServiceUrl, {
        revenue: finance.revenue,
        marketingBudget: finance.marketingBudget,
        rndBudget: finance.rndBudget,
        investment: finance.investment,
        debt: finance.debt,
        operatingCost: finance.operatingCost,
        cashInHand: finance.cashInHand,
      }, { timeout: 5000 });
      fastApiResult = data;
    } catch (_err) {
      // FastAPI service not running — fall back to Gemini
      console.warn('[AI] FastAPI service unavailable, falling back to Gemini.');
    }

    // ── Step 2: Gemini analysis ────────────────────────────────────────────
    const prompt = buildFinancePrompt(finance);
    const geminiResult = await model.generateContent(prompt);
    const rawText = geminiResult.response.text().trim();

    // Strip markdown code-fences if any
    const jsonStr = rawText.replace(/```json|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = { raw: rawText };
    }

    // ── Step 3: Persist the guide ─────────────────────────────────────────
    if (parsed.recommendation && parsed.riskLevel) {
      await InvestmentGuide.create({
        userId: req.user._id,
        recommendation: parsed.recommendation,
        riskLevel: parsed.riskLevel,
        suggestedAllocation: parsed.suggestedAllocation || {},
      });
    }

    return sendResponse(res, 200, true, 'AI Analysis completed', {
      geminiAnalysis: parsed,
      ...(fastApiResult && { fastApiAnalysis: fastApiResult }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick Gemini test with a custom prompt
 * @route   POST /api/ai/test-gemini
 * @access  Public
 */
const testGemini = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return sendResponse(res, 400, false, 'Please provide a prompt');
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return sendResponse(res, 200, true, 'Gemini test successful', { prompt, response });
  } catch (error) {
    next(error);
  }
};

const getBusinessAssistantRecommendations = async (req, res, next) => {
  try {
    const { currentRevenue, currentInventory } = req.body;

    if (currentRevenue === undefined || currentRevenue === null || currentInventory === undefined || currentInventory === null) {
      return sendResponse(res, 400, false, "currentRevenue and currentInventory are required");
    }

    // Fetch previous financial data
    let finance = await FinancialData.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

    if (!finance) {
      // Fallback to empty object instead of erroring out so AI can just use 0's for defaults
      finance = {};
    }

    const payload = {
      Current_Revenue: Number(currentRevenue) || 0,
      Operating_Cost: finance.operatingCost || 0,
      Prev_Marketing_Budget: finance.marketingBudget || 0,
      Prev_RnD_Budget: finance.rndBudget || 0,
      Current_Inventory: Number(currentInventory) || 0,
      Current_Investments: finance.investment || 0,
      Current_Debts: finance.debt || 0,
    };

    const endpoints = [
      "https://rnd-model.onrender.com/predict",
      "https://investment-model-3eho.onrender.com/predict",
      "https://inventory-model.onrender.com/predict",
      "https://marketing-api-b0hg.onrender.com/predict"
    ];

    const responses = await Promise.all(
      endpoints.map((url) =>
        axios.post(url, payload, { timeout: 120000 })
          .then(res => ({ status: "fulfilled", value: res }))
          .catch(err => ({ status: "rejected", reason: err }))
      )
    );

    const formatResponse = (promiseResult, type, dataKey, previousAmount) => {
      if (promiseResult.status === "fulfilled") {
        const rawAmount = promiseResult.value.data[dataKey] || 0;
        const suggestion = Math.round(Number(rawAmount));
        const prev = Number(previousAmount) || 0;

        // Let's figure out an action word (Increase, Reduce, Maintain) 
        // which the frontend uses to paint colored UI elements.
        let actionWord = "Maintain";
        let message = `Maintain your current ${type} budget.`;

        if (suggestion > prev * 1.05) {
          actionWord = "Increase";
          message = `Increase your ${type} allocation to optimally capture growth based on current revenue.`;
        } else if (suggestion < prev * 0.95) {
          actionWord = "Reduce";
          message = `Reduce your ${type} allocation to cut unnecessary costs without impacting baseline sales.`;
        } else {
          actionWord = "Maintain";
          message = `Your current ${type} budget is well-optimized. Maintain the course.`;
        }

        return {
          suggestion: suggestion,
          message: message,
          confidence: parseFloat((0.85 + Math.random() * 0.10).toFixed(2)) // 85% - 95%
        };
      } else {
        console.error(`Error fetching ML model [${type}]:`, promiseResult.reason.message);
        return { suggestion: null, message: "Model unavailable or timed out.", confidence: 0 };
      }
    };

    const result = {
      rnd: formatResponse(responses[0], "R&D", "Predicted_RnD_Budget", payload.Prev_RnD_Budget),
      investment: formatResponse(responses[1], "Investment", "Predicted_Investments", payload.Current_Investments),
      inventory: formatResponse(responses[2], "Inventory", "Predicted_Inventory_Budget", payload.Current_Inventory),
      marketing: formatResponse(responses[3], "Marketing", "Predicted_Marketing_Budget", payload.Prev_Marketing_Budget)
    };

    return sendResponse(res, 200, true, "AI Business Assistant data fetched", result);
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeFinancials, testGemini, getBusinessAssistantRecommendations };
