const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());

app.use(express.json({ limit: '100kb' }));

app.use(express.json());
app.use((req, res, next) => {
    console.log('REQUEST RECEIVED:', req.method, req.url);
    next();
});


// Import routes
const healthRoutes = require('./src/routes/healthRoutes');
const wardRoutes = require('./src/routes/wardRoutes');
 HEAD
const dengueRoutes = require('./src/routes/dengueRoutes');
const predictionRoutes = require('./src/routes/predictionRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');

const predictionRoutes = require('./src/routes/predictionRoutes');


// Register routes
app.use('/api', healthRoutes);
app.use('/api/wards', wardRoutes);
 HEAD
app.use('/api/dengue-cases', dengueRoutes);
app.use('/api/risk-predictions', predictionRoutes);
app.use('/api/weather', weatherRoutes);

app.post('/debug', (req, res) => {
    res.json({ message: 'DEBUG ROUTE WORKS' });
});
console.log('DEBUG ROUTE REGISTERED');
app.use('/api', predictionRoutes);
app.post('/test', (req, res) => res.json({ message: 'TEST ROUTE WORKS' }));
 f972cf1 (Add AI prediction model and backend integration)

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

    // Handle malformed JSON body
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

// Start server
app.listen(PORT, () => {
    console.log('DengueWatch AI Backend is running on port ' + PORT);
});
