const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const renterSchema = new mongoose.Schema({
    machines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'machine'
    }]
});

const renter = mongoose.model("renter", renterSchema)
module.exports.renter = renter;