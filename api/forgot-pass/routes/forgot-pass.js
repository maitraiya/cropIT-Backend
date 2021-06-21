const express = require('express');
const router = express.Router();
const controller = require('../controller/forgot-pass');
const auth = require("../../../middleware/auth");

router.get('/', controller.sendMail);
router.post('/reset', auth, controller.reset);

module.exports = router;