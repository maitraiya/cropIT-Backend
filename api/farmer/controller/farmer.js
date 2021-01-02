const { user } = require('../../../schema/user');
const { farmer } = require('../../../schema/farmer');
const { validateUserForUpdation, validateFarmer } = require('../../../helpers/validations');
const config = require('config');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');

exports.update = asyncMiddleware(async (req, res) => {

    if (!("user" in req.body && "farmer" in req.body))
        return res.status(404).json({ message: "Invalid request" })

    const userInfo = req.body.user;
    const { error } = validateUserForUpdation(req.body.user);
    if (error) return res.status(400).json(error.message);

    let farmerExist = await farmer.findOne({ user: { _id: req.params.id } }).populate('user');
    if (!farmerExist) return res.status(404).json({ message: 'No farmer record found!' });

    let userUpdationObj = {
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city
    }

    if ("farmer" in req.body) {
        const farmerInfo = req.body.farmer;
        const { error } = validateFarmer(req.body.farmer);
        if (error) return res.status(400).json({ error: error.message });

        await user.findOneAndUpdate({ _id: farmerExist.user._id }, userUpdationObj);
        let farmerUpdationObj = {
            landArea: farmerInfo.landArea,
            material: farmerInfo.material
        }
        await farmer.findOneAndUpdate({ _id: req.params.id }, farmerUpdationObj);
        return res.status(200).json({ message: 'Farmer record updated succesfully' });
    }
});

exports.getAllFarmers = asyncMiddleware(async (req, res) => {
    let allFarmers = await farmer.find().populate('user').populate('material');
    if (allFarmers.length == 0) return res.status(200).json({ message: 'No farmer record found!' });
    return res.status(200).json(allFarmers);
});
exports.getFarmer = asyncMiddleware(async (req, res) => {
    let farmerRecord = await farmer.findOne({ user: { _id: req.params.id } }).populate('user').populate('material');
    if (!farmerRecord) return res.status(200).json({ message: 'No farmer record found!' });
    return res.status(200).json(farmerRecord);
});
exports.deleteFarmer = asyncMiddleware(async (req, res) => {
    let farmerRecord = await farmer.findOne({ _id: req.params.id }).populate('user').populate('material');
    if (!farmerRecord) return res.status(200).json({ message: 'No Farmer record found!' });
    await farmer.findByIdAndRemove(req.params.id);
    await user.findByIdAndRemove(farmerRecord.user._id);
    return res.status(200).json({ message: 'Farmer record deleted successfully' });
});