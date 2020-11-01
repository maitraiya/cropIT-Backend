const express = require('express');
const router = express.Router();
const materialController = require('../controller/material');
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const admin_company_farmer = require('../../../middleware/admin_company_farmer');


router.post('/', [auth, admin], materialController.add);
router.put('/:id', [auth, admin], materialController.update);
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterial);
router.delete('/:id', [auth, admin], materialController.deleteMaterial);

module.exports = router;