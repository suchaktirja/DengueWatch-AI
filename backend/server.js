const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Import routes
const healthRoutes = require('./src/routes/healthRoutes');
const wardRoutes = require('./src/routes/wardRoutes');
const dengueRoutes = require('./src/routes/dengueRoutes');
const predictionRoutes = require('./src/routes/predictionRoutes');
const aiPredictionRoutes = require('./src/routes/aiPredictionRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');

// Register routes
app.use('/api', healthRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/dengue-cases', dengueRoutes);
app.use('/api/risk-predictions', predictionRoutes);
app.use('/api', aiPredictionRoutes);
app.use('/api/weather', weatherRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'DengueWatch AI Backend is running'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Invalid JSON payload'
        });
    }

    const statusCode = err.status || err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = (isProduction && statusCode >= 500)
        ? 'Internal Server Error'
        : (err.message || 'Internal Server Error');

    res.status(statusCode).json({
        message
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start local dev server only outside of serverless (Vercel) runtime
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log('DengueWatch AI Backend is running on port ' + PORT);
    });
}

// Export app for Vercel serverless runtime
module.exports = app;
