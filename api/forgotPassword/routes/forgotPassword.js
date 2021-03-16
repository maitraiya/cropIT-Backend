const express = require('express');
const router = express.Router();

const forgotPasswordController = require('../controller/forgotPassword');

router.post('/', forgotPasswordController.changePassword);

module.exports = router;
