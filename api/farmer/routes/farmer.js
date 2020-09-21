const express = require('express');
const router = express.Router();
const farmerController = require('../controller/farmer');

router.put('/:id', farmerController.update);
router.get('/', farmerController.getAllFarmers);
router.get('/:id', farmerController.getFarmer);
router.delete('/:id', farmerController.deleteFarmer);

module.exports = router;