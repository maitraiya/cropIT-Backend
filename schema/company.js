const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const companySchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    material: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 250
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const company = mongoose.model("company", companySchema)
module.exports.company = company;