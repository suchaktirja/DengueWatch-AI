const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const healthRoutes = require('./src/routes/healthRoutes');

// Register routes
app.use('/api', healthRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'DengueWatch AI Backend is running'
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log('DengueWatch AI Backend is running on port ' + PORT);
});
