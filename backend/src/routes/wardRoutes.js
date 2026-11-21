const express = require('express');
const router = express.Router();

// Get all wards
router.get('/', (req, res) => {
    res.json({
        message: 'Ward API is working',
        wards: []
    });
});

module.exports = router;
