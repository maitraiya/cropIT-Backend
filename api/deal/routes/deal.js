const express = require('express');
const router = express.Router();
const dealController = require('../controller/deal');
const auth = require("../../../middleware/auth");
const adminOrCompany = require("../../../middleware/admin_company");
const adminOrFarmer = require("../../../middleware/admin_farmer");
const admin_company_farmer = require('../../../middleware/admin_company_farmer');

router.post('/', [auth, adminOrFarmer], dealController.add);
router.get('/', [auth, admin_company_farmer], dealController.getAllDeals);
router.get('/:id', [auth, admin_company_farmer], dealController.getDeal);
router.delete('/:id', [auth, adminOrFarmer], dealController.deleteDeal);

module.exports = router;