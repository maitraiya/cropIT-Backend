const express = require('express');
const router = express.Router();
const comapanyController = require('../controller/company');

router.put('/:id', comapanyController.update);
router.get('/', comapanyController.getAllCompanies);
router.get('/:id', comapanyController.getCompany);
router.delete('/:id', comapanyController.deleteCompany);

module.exports = router;