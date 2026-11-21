const axios = require('axios');

const AI_TIMEOUT_MS = 30000; // 30 seconds

const getPrediction = async (req, res) => {
    const aiServiceUrl = process.env.AI_SERVICE_URL;

    // Guard: AI service URL not configured
    if (!aiServiceUrl) {
        return res.status(503).json({
            status: 'unavailable',
            message: 'AI prediction service is not deployed yet.'
        });
    }

    try {
        const response = await axios.post(
            `${aiServiceUrl}/predict`,
            req.body,
            { timeout: AI_TIMEOUT_MS }
        );

        res.json(response.data);

    } catch (error) {
        console.error('Prediction Error:', error.message);

        res.status(502).json({
            status: 'error',
            message: 'AI prediction service is unavailable. Please try again later.'
        });
    }
};

module.exports = {
    getPrediction
};
