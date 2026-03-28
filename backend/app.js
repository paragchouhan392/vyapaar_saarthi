const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply rate limiting to all requests
app.use(apiLimiter);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to AI Financial Advisor API' });
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  next(error);
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
