const express = require('express');
const router = express.Router();
const rentedController = require('../controller/rented');
const auth = require("../../../middleware/auth");
const admin_renter = require('../../../middleware/admin_renter');
const admin_farmer_renter = require('../../../middleware/admin_renter_farmer');
const admin_farmer = require('../../../middleware/admin_farmer');

router.post('/', [auth, admin_farmer], rentedController.add);
router.put('/:id', [auth, admin_farmer_renter], rentedController.update);
router.get('/', [auth, admin_farmer_renter], rentedController.getAllRentedItems);
router.get('/:id', [auth, admin_farmer_renter], rentedController.getRentedItem);

module.exports = router;