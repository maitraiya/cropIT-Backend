const config = require('config');
const { posting } = require("../../../schema/posting");
const { farmer } = require("../../../schema/farmer");
const bcrypt = require("bcrypt");
const { validatePosting } = require('../../../helpers/validations');
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const moment = require('moment');

exports.add = asyncMiddleware(async(req, res) => {

    const { error } = validatePosting(req.body);
    if (error) return res.status(400).send(error.message);

    const date = moment(req.body.expiryDate).format("YYYY-MM-DD");
    if (date >= moment().format("YYYY-MM-DD")) {
        let postingObj = new posting({
            cost: req.body.cost,
            expiryDate: req.body.expiryDate,
            material: req.body.material,
            addedBy: req.token._id
        });
        await postingObj.save();
        return res.status(400).send("Posting added successfully.");
    } else return res.status(400).send("Please enter a valid date.");
});

exports.update = asyncMiddleware(async(req, res) => {

    const { error } = validatePosting(req.body);
    if (error) return res.status(400).send(error.message);

    const date = moment(req.body.expiryDate).format("YYYY-MM-DD");
    if (date >= moment().format("YYYY-MM-DD")) {
        let postingExist = await posting.findOne({ _id: req.params.id });
        if (postingExist) {
            let postingObj = {
                cost: req.body.cost,
                expiryDate: req.body.expiryDate,
                material: req.body.material,
                addedBy: postingExist.addedBy
            }
            await posting.findOneAndUpdate({ _id: postingExist._id }, postingObj);
            return res.status(400).send("Posting updated successfully.");
        } else return res.status(400).send("No posting found.");
    } else return res.status(400).send("Please enter a valid date");
});

exports.getAllPosting = asyncMiddleware(async(req, res) => {
    let allPostings;
    if (req.token.userType == config.get("userType")[1]) {
        allPostings = await posting.find({ addedBy: req.token._id }).populate('material');
        if (allPostings.length == 0) return res.status(200).send('No posting record found!');
        return res.status(200).send(allPostings);
    } else if (req.token.userType == config.get("userType")[2]) {
        let farmerDetails = await farmer.findOne({ _id: req.token._id });
        let postings = [];
        if (farmerDetails) {
            let farmerMaterials = farmerDetails.material;
            if (farmerMaterials.length > 0) {
                await Promise.all(farmerMaterials.map(async(data) => {
                    let postingInfo = await posting.findOne({ "material": data });
                    if (postingInfo && moment(postingInfo.expiryDate).format("YYYY-MM-DD") <= moment().format("YYYY-MM-DD")) postings.push(postingInfo);
                }));
                if (postings.length > 0) return res.status(200).send(postings);
                else return res.status(200).send("No posting found");
            } else return res.status(400).send("No material found.");
        } else return res.status(400).send("Authentication error.");
    } else if (req.token.userType == config.get("userType")[0]) {
        allPostings = await posting.find().populate('material');
        if (allPostings.length == 0) return res.status(200).send('No posting record found!');
        return res.status(200).send(allPostings);
    }
});

exports.getPosting = asyncMiddleware(async(req, res) => {
    let postingRecord = await posting.findOne({ _id: req.params.id }).populate('material');
    if (!postingRecord) return res.status(200).send('No posting record found!');
    return res.status(200).send(postingRecord);
});

exports.deletePosting = asyncMiddleware(async(req, res) => {
    let postingRecord = await posting.findOne({ _id: req.params.id }).populate('material');
    if (!postingRecord) return res.status(200).send('No posting record found!');
    await posting.findByIdAndRemove(req.params.id);
    return res.status(200).send('Posting record deleted successfully');
});