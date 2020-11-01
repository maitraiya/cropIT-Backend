const config = require('config');
const _ = require("lodash");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const { machine } = require("../../../schema/machine");
const { validateMachine } = require('../../../helpers/validations');
const moment = require('moment');

exports.add = asyncMiddleware(async(req, res) => {
    const { error } = validateMachine(req.body);
    if (error) return res.status(400).send(error.message);
    if (moment(req.body.availabilityDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
        machineInfo = re.body;
        let machineTemp = new machine({
            name: machineInfo.name,
            charges: machineInfo.charges,
            image: machineInfo.image,
            availabilityDate: machineInfo.availabilityDate,
            status: config.get("machineStatus")[0],
            ownedBy: req.token._id
        });
        await machineTemp.save();
        return res.status(200).send("Machine added successfully");
    } else return res.status(400).send("Availability Date cannot be today's or past date!");
});

exports.update = asyncMiddleware(async(req, res) => {
    let machineExist = await machine.findOne({ _id: req.params.id });
    if (!machineExist) return res.status(404).send("No machine record found");

    const { error } = validateMachine(req.body);
    if (error) return res.status(400).send(error.message);

    if (moment(req.body.availabilityDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
        machineInfo = re.body;
        let machineTemp = new machine({
            name: machineInfo.name,
            charges: machineInfo.charges,
            image: machineInfo.image,
            availabilityDate: machineInfo.availabilityDate,
            status: machineInfo.status
        });
        await machineTemp.save();
        return res.status(200).send("Machine updated successfully");
    } else return res.status(400).send("Availability Date cannot be today's or past date!");

});

exports.getAllMachines = asyncMiddleware(async(req, res) => {
    let allMachines = await material.find();
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
    await machine.findByIdAndRemove(req.params.id);
    return res.status(200).send('Machine record deleted successfully');
});