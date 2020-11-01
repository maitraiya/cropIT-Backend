const express = require('express');
const router = express.Router();
const machineController = require('../controller/machine');
const auth = require("../../../middleware/auth");
const admin_renter = require('../../../middleware/admin_renter');
const admin_renter_farmer = require("../../../middleware/admin_renter_farmer");

router.post('/', [auth, admin_renter], machineController.add);
router.put('/:id', [auth, admin_renter], machineController.update);
router.get('/', [auth, admin_renter_farmer], machineController.getAllMachines);
router.get('/:id', [auth, admin_renter_farmer], machineController.getMachine);
router.delete('/:id', [auth, admin_renter], machineController.deleteMachine);

module.exports = router;