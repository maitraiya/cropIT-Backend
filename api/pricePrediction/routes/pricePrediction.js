const express = require('express');
const router = express.Router();
const pricePredictionController = require('../controller/pricePrediction');
const auth = require("../../../middleware/auth");
const adminOrFarmer = require("../../../middleware/admin_farmer");

router.get('/:id', [auth, adminOrFarmer], pricePredictionController.predict);

module.exports = router;