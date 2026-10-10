
 // server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const aiRoutes = require('./routes/aiRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const configuredOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : null;

const corsOptions = {
  origin:
    configuredOrigins ||
    (process.env.NODE_ENV === 'production' ? false : '*')
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI WeatherWise backend is running'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI WeatherWise API is running'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/ai', aiRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AI WeatherWise backend running on port ${PORT}`);
});
