const express = require('express');
const router = express.Router();
const farmerController = require('../controller/farmer');
const auth = require("../../../middleware/auth");
const adminOrFarmer = require("../../../middleware/admin_farmer");

router.post('/:id', [auth, adminOrFarmer], farmerController.update);
router.get('/', [auth, adminOrFarmer], farmerController.getAllFarmers);
router.get('/:id', [auth, adminOrFarmer], farmerController.getFarmer);
router.delete('/:id', [auth, adminOrFarmer], farmerController.deleteFarmer);

module.exports = router;