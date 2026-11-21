// Health check controller
const getHealth = (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend API is healthy'
    });
};

module.exports = {
    getHealth
};
