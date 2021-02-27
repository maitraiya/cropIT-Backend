const config = require('config');
const { rented } = require("../../../schema/rented");
const { machine } = require("../../../schema/machine");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const moment = require('moment');
const { validateRented } = require('../../../helpers/validations');

exports.add = asyncMiddleware(async(req, res) => {
    const { error } = validateRented(req.body);
    if (error) return res.status(400).json(error.message);

    const rentedDetails = req.body;
    diff = moment(rentedDetails.toDate).diff(moment(rentedDetails.fromDate), 'days');
    if (diff < config.get("minRentDays")) return res.status(400).json(`Item should be rented for min ${config.get("minRentDays")} days`);

    const machineDetails = await machine.findOne({ _id: rentedDetails.machine });
    if (!machineDetails) return res.status(500).json("Internal Server Error");
    let rentedInfo = new rented({
        renter: rentedDetails.renter,
        farmer: rentedDetails.farmer,
        machine: rentedDetails.machine,
        fromDate: rentedDetails.fromDate,
        toDate: rentedDetails.toDate,
        amount: diff * machineDetails.charges,
        status: config.get("rentStatus")[0]
    })
    await rentedInfo.save();
    await machine.findOneAndUpdate({ _id: machineDetails._id }, { status: config.get("machineStatus")[1] });
    return res.status(200).json("Item rented successfully!");
});
exports.update = asyncMiddleware(async(req, res) => {
    const { error } = validateRented(req.body);
    if (error) return res.status(400).json(error.message);

    const rentedExists = await rented.findOne({ _id: req.params.id });
    if (!rentedExists) return res.status(404).json("No rented recotrd found");

    const rentedDetails = req.body;

    diff = moment(rentedDetails.toDate).diff(moment(rentedDetails.fromDate), 'days');
    if (diff < config.get("minRentDays")) return res.status(400).json(`Item should be rented for min ${config.get("minRentDays")} days`);

    let machineDetails = await machine.findOne({ _id: rentedDetails.machine });
    if (!machineDetails) return res.status(500).json("Internal Server Error");

    let rentedInfo = {
        renter: rentedDetails.renter,
        farmer: rentedDetails.farmer,
        machine: rentedDetails.machine,
        fromDate: rentedDetails.fromDate,
        toDate: rentedDetails.toDate,
        amount: diff * machineDetails.charges,
        status: rentedDetails.status
    }
    await rented.findOneAndUpdate({ _id: rentedExists._id }, rentedInfo);
    if (rentedDetails.status == config.get("rentStatus")[1]) {
        await machine.findOneAndUpdate({ _id: machineDetails._id }, { status: config.get("machineStatus")[0] });
    } else if (rentedDetails.status == config.get("rentStatus")[0]) {
        await machine.findOneAndUpdate({ _id: machineDetails._id }, { status: config.get("machineStatus")[1] });
    }
    return res.status(200).json("Rented record updated successfully!");
});


exports.getAllRentedItems = asyncMiddleware(async(req, res) => {
    let allRentedItems;
    if (req.token.userType == config.get("userType")[3]) {
        allRentedItems = await rented.find({ renter: req.token._id }).populate('machine');
        return res.status(200).json(allRentedItems);
    } else if (req.token.userType == config.get("userType")[2]) {
        allRentedItems = await rented.find({ farmer: req.token._id }).populate('machine');
        return res.status(200).json(allRentedItems);

    } else if (req.token.userType == config.get("userType")[0]) {
        allRentedItems = await rented.find().populate('machine');
        return res.status(200).json(allRentedItems);
    }
});

exports.getRentedItem = asyncMiddleware(async(req, res) => {
    let rentedRecord = await rented.findOne({ _id: req.params.id }).populate('machine');
    return res.status(200).json(rentedRecord);
});