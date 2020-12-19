const { user } = require('../../../schema/user');
const { company } = require('../../../schema/company');
const { validateUserForUpdation, validateCompany } = require('../../../helpers/validations');
const config = require('config');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');

exports.update = asyncMiddleware(async(req, res) => {

    if (!("user" in req.body && "company" in req.body))
        return res.status(404).send("Invalid request")

    const userInfo = req.body.user;
    const { error } = validateUserForUpdation(req.body.user);
    if (error) return res.status(400).send(error.message);

    let companyExist = await company.findOne({ _id: req.params.id }).populate('user');
    if (!companyExist) return res.status(404).send('No company record found!');

    let userUpdationObj = {
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city
    }

    if ("company" in req.body) {
        const companyInfo = req.body.company;
        const { error } = validateCompany(req.body.company);
        if (error) return res.status(400).send(error.message);

        await user.findOneAndUpdate({ _id: companyExist.user._id }, userUpdationObj);
        let companyUpdationObj = {
            domain: companyInfo.domain,
            material: companyInfo.material
        }
        await company.findOneAndUpdate({ _id: req.params.id }, companyUpdationObj);
        return res.status(200).send('company record updated succesfully');
    }
});

exports.getAllcompanies = asyncMiddleware(async(req, res) => {
    let allcompanies = await company.find().populate('user').populate('material');
    if (allcompanies.length == 0) return res.status(200).send('No company record found!');
    return res.status(200).send(allcompanies);
});
exports.getcompany = asyncMiddleware(async(req, res) => {
    let companyRecord = await company.findOne({ user: { _id: req.params.id } }).populate('user').populate('material');
    if (!companyRecord) return res.status(200).send('No company record found!');
    return res.status(200).send(companyRecord);
});
exports.deleteCompany = asyncMiddleware(async(req, res) => {
    let companyRecord = await company.findOne({ _id: req.params.id }).populate('user').populate('material');
    if (!companyRecord) return res.status(200).send('No company record found!');
    await company.findByIdAndRemove(req.params.id);
    await user.findByIdAndRemove(companyRecord.user._id);
    return res.status(200).send('Company record deleted successfully');
});