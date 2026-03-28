const { GoogleGenerativeAI } = require('@google/generative-ai');
const Scheme = require('../models/Scheme');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// @desc    Get government schemes for business
// @route   POST /api/schemes/get-schemes
// @access  Private
const getGovernmentSchemes = async (req, res, next) => {
  try {
    const { businessDescription } = req.body;

    if (!businessDescription || businessDescription.trim() === '') {
      res.status(400);
      throw new Error('Please provide a business description');
    }

    console.log('Fetching government schemes for business:', businessDescription);

    // Create a detailed prompt for Gemini to fetch Indian government schemes
    const schemePrompt = `You are an expert in Indian government business schemes and subsidies. Based on the following business description, provide relevant government schemes that this business can take advantage of.

Business Description: "${businessDescription}"

Please provide 5-8 specific and relevant Indian government schemes in the following JSON format:

{
  "schemes": [
    {
      "schemeName": "Full scheme name",
      "benefits": "Detailed benefits of the scheme (include eligibility criteria, financial assistance/benefits offered)",
      "schemeLink": "Official government scheme link or portal URL"
    }
  ]
}

Important Guidelines:
- Include real Indian government schemes (from ministries like MSME, Commerce & Industry, etc.)
- Schemes should be relevant to the business type described
- Include schemes like PMMY, MUDRA, GST registration benefits, tax incentives, subsidies, etc.
- Provide accurate links to official government portals or scheme pages
- Ensure the benefits clearly mention what financial or non-financial support is provided
- If schemes have specific eligibility criteria, mention them in the benefits section
- Return ONLY valid and currently active schemes
- Format the response as valid JSON`;

    try {
      const result = await model.generateContent(schemePrompt);
      const response = result.response;
      const text = response.text();

      console.log('Gemini Response:', text);

      // Parse the JSON response from Gemini
      let parsedSchemes;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedSchemes = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        res.status(500);
        throw new Error('Failed to parse scheme data from AI');
      }

      if (!parsedSchemes.schemes || !Array.isArray(parsedSchemes.schemes)) {
        res.status(500);
        throw new Error('Invalid scheme data format from AI');
      }

      // Save schemes to database
      let savedScheme;
      try {
        // Check if schemes already exist for this business description
        savedScheme = await Scheme.findOne({ userId: req.user.id, businessDescription });

        if (savedScheme) {
          // Update existing scheme record
          savedScheme.schemes = parsedSchemes.schemes;
          savedScheme.updatedAt = Date.now();
          await savedScheme.save();
        } else {
          // Create new scheme record
          savedScheme = await Scheme.create({
            userId: req.user.id,
            businessDescription,
            schemes: parsedSchemes.schemes
          });
        }
      } catch (dbError) {
        console.error('Database Error:', dbError.message);
        throw new Error('Failed to save schemes to database');
      }

      return res.status(200).json({
        success: true,
        message: 'Government schemes fetched successfully',
        data: {
          businessDescription,
          totalSchemes: parsedSchemes.schemes.length,
          schemes: parsedSchemes.schemes,
          fetchedAt: new Date().toISOString()
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
    console.error('Get Schemes Error:', error.message);
    next(error);
  }
};

// @desc    Get all schemes for a user
// @route   GET /api/schemes
// @access  Private
const getAllSchemes = async (req, res, next) => {
  try {
    const schemes = await Scheme.find({ userId: req.user.id }).sort({ generatedAt: -1 });

    if (!schemes || schemes.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schemes found',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Schemes retrieved successfully',
      data: schemes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get schemes by ID
// @route   GET /api/schemes/:id
// @access  Private
const getSchemesById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      res.status(404);
      throw new Error('Schemes not found');
    }

    if (scheme.userId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to access these schemes');
    }

    return res.status(200).json({
      success: true,
      message: 'Schemes retrieved successfully',
      data: scheme
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get schemes by business type
// @route   GET /api/schemes/search/:businessType
// @access  Private
const getSchemesByBusinessType = async (req, res, next) => {
  try {
    const { businessType } = req.params;

    const schemes = await Scheme.find({
      userId: req.user.id,
      businessDescription: { $regex: businessType, $options: 'i' }
    }).sort({ generatedAt: -1 });

    if (!schemes || schemes.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schemes found for this business type',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Schemes retrieved successfully',
      data: schemes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGovernmentSchemes,
  getAllSchemes,
  getSchemesById,
  getSchemesByBusinessType
};
