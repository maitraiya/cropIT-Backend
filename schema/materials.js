const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const materialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

const material = mongoose.model("material", materialSchema)
module.exports.material = material;