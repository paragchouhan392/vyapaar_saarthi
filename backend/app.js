const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// ── Route files ───────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const financeRoutes = require('./routes/financeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const balanceSheetRoutes = require('./routes/balanceSheetRoutes');
const investmentGuideRoutes = require('./routes/investmentGuideRoutes');
const orgProfileRoutes = require('./routes/orgProfileRoutes');
const mlRoutes = require('./routes/mlroute');
const app = express();

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Dev logging (off in production)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting on all API requests
app.use('/api', apiLimiter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Vyapaar Sarrthi — AI Financial SaaS API',
    version: '2.0.0',
  });
});

// ── Mount routers ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/balance', balanceSheetRoutes);
app.use('/api/investment-guide', investmentGuideRoutes);
app.use('/api/org-profile', orgProfileRoutes);
app.use('/api/ml', mlRoutes);
// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  next(error);
});

// ── Centralised error handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
