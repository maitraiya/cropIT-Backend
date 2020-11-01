const express = require('express');
const router = express.Router();
const renterController = require('../controller/renter');
const auth = require("../../../middleware/auth");
const adminOrRenter = require("../../../middleware/admin_renter");
const admin = require("../../../middleware/admin");

router.put('/:id', [auth, adminOrRenter], renterController.update);
router.get('/', [auth, adminOrRenter], renterController.getAllRenters);
router.get('/:id', [auth, adminOrRenter], renterController.getRenter);
router.delete('/:id', [auth, adminOrRenter], renterController.deleteRenter);

module.exports = router;