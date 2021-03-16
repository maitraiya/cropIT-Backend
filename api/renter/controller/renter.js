const { user } = require('../../../schema/user');
const { renter } = require('../../../schema/renter');
const { validateUserForUpdation } = require('../../../helpers/validations');
const config = require('config');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');

exports.update = asyncMiddleware(async(req, res) => {

    if (!("user" in req.body))
        return res.status(404).send("Invalid request")

    const userInfo = req.body.user;
    const { error } = validateUserForUpdation(req.body.user);
    if (error) return res.status(400).send(error.message);

    let renterExist = await renter.findOne({ _id: req.params.id }).populate('user');
    if (!renterExist) return res.status(404).send('No renter record found!');

    let userUpdationObj = {
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city,
        profile: userInfo.profile
    }
    await user.findOneAndUpdate({ _id: renterExist.user._id }, userUpdationObj);
    return res.status(200).send('Renter record updated succesfully');

});

exports.getAllRenters = asyncMiddleware(async(req, res) => {
    let allRenters = await renter.find().populate('user').populate('machine');
    if (allRenters.length == 0) return res.status(200).send('No renter record found!');
    return res.status(200).send(allRenters);
});
exports.getRenter = asyncMiddleware(async(req, res) => {
    let renterRecord = await renter.findOne({ _id: req.params.id }).populate('user').populate('machine');
    if (!renterRecord) return res.status(200).send('No renter record found!');
    return res.status(200).send(renterRecord);
});
exports.deleteRenter = asyncMiddleware(async(req, res) => {
    let renterRecord = await renter.findOne({ _id: req.params.id }).populate('user').populate('machine');
    if (!renterRecord) return res.status(200).send('No renter record found!');
    await renter.findByIdAndRemove(req.params.id);
    await user.findByIdAndRemove(renterRecord.user._id);
    return res.status(200).send('Renter record deleted successfully');
});