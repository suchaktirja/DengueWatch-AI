const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const healthRoutes = require('./src/routes/healthRoutes');
const wardRoutes = require('./src/routes/wardRoutes');
const dengueRoutes = require('./src/routes/dengueRoutes');
const predictionRoutes = require('./src/routes/predictionRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');

// Register routes
app.use('/api', healthRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/dengue-cases', dengueRoutes);
app.use('/api/risk-predictions', predictionRoutes);
app.use('/api/weather', weatherRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'DengueWatch AI Backend is running'
    });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error'
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log('DengueWatch AI Backend is running on port ' + PORT);
});
