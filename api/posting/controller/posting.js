const config = require('config');
const { posting } = require("../../../schema/posting");
const { farmer } = require("../../../schema/farmer");
const { user } = require("../../../schema/user");

const bcrypt = require("bcrypt");
const { validatePosting } = require('../../../helpers/validations');
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const moment = require('moment');
const transporter = require('../../../helpers/SMTP');

exports.add = asyncMiddleware(async (req, res) => {

    const { error } = validatePosting(req.body);
    if (error) return res.status(400).json(error.message);

    const date = moment(req.body.expiryDate).format("YYYY-MM-DD");
    if (date >= moment().format("YYYY-MM-DD")) {
        let postingObj = new posting({
            cost: req.body.cost,
            expiryDate: req.body.expiryDate,
            material: req.body.material,
            addedBy: req.token._id
        });
        await postingObj.save();
        let farmersHavingMaterial = [];
        let farmers = await farmer.find();
        farmers.map(async (farmerInfo) => {
            farmerInfo.material.map(async (data) => {
                if (req.body.material == data)
                    farmersHavingMaterial.push(farmerInfo.user);
            })
        })
        await Promise.all(farmersHavingMaterial.map(async (data) => {
            let tempUserInfo = await user.findOne({ _id: data });
            if (tempUserInfo) {
                var mailOptions = {
                    to: tempUserInfo.email,
                    subject: 'New Posting',
                    text: `You have got a new posting, Please login to CropIt portal for more details.`
                };
                try {
                    const result = await transporter.sendMail(mailOptions);
                } catch (err) { }
            }
        }));
        return res.status(400).json("Posting added successfully.");
    } else return res.status(400).json("Please enter a valid date.");
});

exports.update = asyncMiddleware(async (req, res) => {

    const { error } = validatePosting(req.body);
    if (error) return res.status(400).json(error.message);

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
            return res.status(400).json("Posting updated successfully.");
        } else return res.status(400).json("No posting found.");
    } else return res.status(400).json("Please enter a valid date");
});

exports.getAllPosting = asyncMiddleware(async (req, res) => {
    let allPostings;
    if (req.token.userType == config.get("userType")[1]) {
        allPostings = await posting.find({ addedBy: req.token._id }).populate('material').populate({ path: 'company', populate: { path: 'user' } });
        return res.status(200).json(allPostings);
    } else if (req.token.userType == config.get("userType")[2]) {
        let farmerDetails = await farmer.findOne({ _id: req.token._id });
        let postings = [];
        if (farmerDetails) {
            let farmerMaterials = farmerDetails.material;
            if (farmerMaterials.length > 0) {
                await Promise.all(farmerMaterials.map(async (data) => {
                    let postingInfo = await posting.findOne({ "material": data }).populate('material').populate({ path: 'company', populate: { path: 'user' } });
                    if (postingInfo && moment(postingInfo.expiryDate).format("YYYY-MM-DD") <= moment().format("YYYY-MM-DD")) postings.push(postingInfo);
                }));
                if (postings.length > 0) return res.status(200).json(postings);
                else return res.status(200).json("No posting found");
            } else return res.status(400).json("No material found.");
        } else return res.status(400).json("Authentication error.");
    } else if (req.token.userType == config.get("userType")[0]) {
        allPostings = await posting.find().populate('material');
        if (allPostings.length == 0) return res.status(200).json('No posting record found!');
        return res.status(200).json(allPostings);
    }
});

exports.getPosting = asyncMiddleware(async (req, res) => {
    let postingRecord = await posting.findOne({ _id: req.params.id }).populate({ path: 'company', populate: { path: 'user' } });
    if (!postingRecord) return res.status(200).json('No posting record found!');
    return res.status(200).json(postingRecord);
});

exports.deletePosting = asyncMiddleware(async (req, res) => {
    let postingRecord = await posting.findOne({ _id: req.params.id }).populate('material');
    if (!postingRecord) return res.status(200).json('No posting record found!');
    await posting.findByIdAndRemove(req.params.id);
    return res.status(200).json('Posting record deleted successfully');
});