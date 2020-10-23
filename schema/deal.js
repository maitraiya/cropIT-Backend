const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const dealSchema = new mongoose.Schema({
    posting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posting'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmer'
    }
});

const deal = mongoose.model("deal", dealSchema)
module.exports.deal = deal;