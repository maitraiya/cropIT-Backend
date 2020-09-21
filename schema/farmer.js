const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const farmerSchema = new mongoose.Schema({
    landArea: {
        type: Number,
        required: true
    },
    material: {
        type: String,
        required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const farmer = mongoose.model("farmer", farmerSchema)
module.exports.farmer = farmer;