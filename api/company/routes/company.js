const express = require('express');
const router = express.Router();
const companyController = require('../controller/company');
const auth = require("../../../middleware/auth");
const adminOrCompany = require("../../../middleware/admin_company");

router.post('/:id', [auth, adminOrCompany], companyController.update);
router.get('/', [auth, adminOrCompany], companyController.getAllcompanies);
router.get('/:id', [auth, adminOrCompany], companyController.getcompany);
router.delete('/:id', [auth, adminOrCompany], companyController.deleteCompany);

module.exports = router;