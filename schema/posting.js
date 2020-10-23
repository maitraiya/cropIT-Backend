const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const postingSchema = new mongoose.Schema({
    cost: {
        type: Number,
        required: true
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'material'
    },
    expiryDate: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    }
});

const posting = mongoose.model("posting", postingSchema)
module.exports.posting = posting;