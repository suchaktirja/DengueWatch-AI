const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend API is healthy'
    });
});

module.exports = router;
