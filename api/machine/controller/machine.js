const config = require('config');
const _ = require("lodash");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const { machine } = require("../../../schema/machine");
const { renter } = require("../../../schema/renter");
const { validateMachine } = require('../../../helpers/validations');
const moment = require('moment');

exports.add = asyncMiddleware(async(req, res) => {
    const { error } = validateMachine(req.body);
    if (error) return res.status(400).send(error.message);
    if (moment(req.body.availabilityDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
        machineInfo = req.body;
        let machineTemp = new machine({
            name: machineInfo.name,
            charges: machineInfo.charges,
            image: machineInfo.image,
            availabilityDate: machineInfo.availabilityDate,
            status: config.get("machineStatus")[0],
            ownedBy: req.token._id
        });
        let renterDetails = await renter.findOne({ _id: req.token._id });

        if (!renterDetails) return res.status(500).send("Internal Server Error");
        await machineTemp.save();
        let arrayOfMachines = [];
        if (renterDetails.machines != undefined) arrayOfMachines = renterDetails.machines;
        arrayOfMachines.push(machineTemp._id);
        let updationObj = {
            machines: arrayOfMachines
        }
        await renter.findOneAndUpdate({ _id: renterDetails._id }, updationObj)
        return res.status(200).send("Machine added successfully");
    } else return res.status(400).send("Availability Date cannot be today's or past date!");
});

exports.update = asyncMiddleware(async(req, res) => {
    let machineExist = await machine.findOne({ _id: req.params.id });
    if (!machineExist) return res.status(404).send("No machine record found");

    const { error } = validateMachine(req.body);
    if (error) return res.status(400).send(error.message);

    if (moment(req.body.availabilityDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
        machineInfo = req.body;
        let machineTemp = {
            name: machineInfo.name,
            charges: machineInfo.charges,
            image: machineInfo.image,
            availabilityDate: machineInfo.availabilityDate,
            status: machineInfo.status
        };
        await machine.findOneAndUpdate({ _id: machineExist._id }, machineTemp);
        return res.status(200).send("Machine updated successfully");
    } else return res.status(400).send("Availability Date cannot be today's or past date!");

});

exports.getAllMachines = asyncMiddleware(async(req, res) => {
    let allMachines = await machine.find();
    if (allMachines.length == 0) return res.status(200).send('No machine record found!');
    return res.status(200).send(allMachines);
});
exports.getMachine = asyncMiddleware(async(req, res) => {
    let machineRecord = await machine.findOne({ _id: req.params.id });
    if (!machineRecord) return res.status(200).send('No machine record found!');
    return res.status(200).send(machineRecord);
});
exports.deleteMachine = asyncMiddleware(async(req, res) => {
    let machineRecord = await machine.findOne({ _id: req.params.id });
    if (!machineRecord) return res.status(200).send('No machine record found!');
    let renterDetails = await renter.findOne({ _id: machineRecord.ownedBy });
    if (!renterDetails) return res.status(500).send("Internal server error")
    let machinesArray = renterDetails.machines;
    const index = machinesArray.indexOf(req.params.id);
    if (index > -1) {
        machinesArray.splice(index, 1);
    }
    await machine.findByIdAndRemove(req.params.id);
    await renter.findOneAndUpdate({ _id: machineRecord.ownedBy }, { machines: machinesArray })
    return res.status(200).send('Machine record deleted successfully');

});