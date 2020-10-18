const express = require('express');
const router = express.Router();
const materialController = require('../controller/material');

router.post('/', materialController.add);
router.put('/:id', materialController.update);
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterial);
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;