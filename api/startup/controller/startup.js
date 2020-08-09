const express = require('express');
const router = express.Router();
const fs = require('fs');

exports.healthCheck = (req, res) => {
    res.status(200).send(`Hello world, Its ${new Date()}`);
}