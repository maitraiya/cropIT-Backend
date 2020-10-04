const express = require('express');
const router = express.Router();
const companyController = require('../controller/company');

router.put('/:id', companyController.update);
router.get('/', companyController.getAllcompanies);
router.get('/:id', companyController.getcompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;