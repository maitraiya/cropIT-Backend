const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');

const machineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    charges: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    availabilityDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    ownedBy: {
        type: mongoose.Schema.Types.ObjectId
    }
});
machineSchema.virtual('renter', {
    ref: 'renter',
    localField: 'ownedBy',
    foreignField: '_id',
    justOne: true,
});
machineSchema.set('toObject', { virtuals: true });
machineSchema.set('toJSON', { virtuals: true });

const machine = mongoose.model("machine", machineSchema)
module.exports.machine = machine;