const express = require('express');
const router = express.Router();
const wardController = require('../controllers/wardController');

// Get all wards
router.get('/', wardController.getAllWards);

module.exports = router;
