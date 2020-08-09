const express = require('express');
const router = express.Router();
const startupController = require('../controller/startup');

router.get('/',startupController.healthCheck);

module.exports= router;