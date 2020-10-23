const express = require('express');
const router = express.Router();
const postingController = require('../controller/posting');
const auth = require("../../../middleware/auth");
const adminOrCompany = require("../../../middleware/admin_company");
const adminOrFarmer = require("../../../middleware/admin_farmer");
const admin_company_farmer = require('../../../middleware/admin_company_farmer');

router.post('/', [auth, adminOrCompany], postingController.add);
router.put('/:id', [auth, adminOrCompany], postingController.update);
router.get('/', [auth, admin_company_farmer], postingController.getAllPosting);
router.get('/:id', [auth, admin_company_farmer], postingController.getPosting);
router.delete('/:id', [auth, adminOrCompany], postingController.deletePosting);

module.exports = router;