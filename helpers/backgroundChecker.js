var schedule = require('node-schedule');
const { machine } = require('../schema/machine');
const config = require("config");
const moment = require('moment');

module.exports = schedule.scheduleJob('00 00 * * *', async() => {
    let allMachines = await machine.find();
    await Promise.all(allMachines.map(async(machineInfo) => {
        if (machineInfo.status == config.get("machineStatus")[0]) {
            let availDate = moment(machineInfo.availabilityDate).format("YYYY-MM-DD");
            let currDate = moment().format("YYYY-MM-DD");
            let diff = moment(currDate).diff(availDate, 'days');
            if (diff <= 0) {
                await machine.findOneAndUpdate({ _id: machineInfo._id }, { status: config.get("machineStatus")[1] })
            }
        }
    }))
});