const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const rentedSchema = new mongoose.Schema({
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'renter'
    },
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'machine'
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmer'
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const rented = mongoose.model("rented", rentedSchema)
module.exports.rented = rented;