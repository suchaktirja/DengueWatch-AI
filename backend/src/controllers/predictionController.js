const axios = require('axios');

const getPrediction = async (req, res) => {
    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/predict',
            req.body
        );

        res.json(response.data);

    } catch (error) {
        console.error('Prediction Error:', error.message);

        res.status(500).json({
            status: 'error',
            message: 'AI prediction service is unavailable'
        });
    }
};

module.exports = {
    getPrediction
};