const config = require('config');
const { deal } = require("../../../schema/deal");
const { posting } = require("../../../schema/posting");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const moment = require('moment');

exports.add = asyncMiddleware(async(req, res) => {

    let postingDetails = posting.findOne({ _id: req.body.postingId });
    if (!postingDetails) res.status(404).send("No posting found!");
    let expiryDate = postingDetails.expiryDate;
    if (moment(expiryDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD"))
        return res.status(400).send("Posting already expired!");
    let dealObj = new deal({
        postingId: req.body.postingId,
        addedBy: req.body.addedBy,
        acceptedBy: req.body.acceptedBy
    });
    await dealObj.save();
    return res.status(400).send("Deal added successfully.");
});


exports.getAllDeals = asyncMiddleware(async(req, res) => {
    let allDeals;
    if (req.token.userType == config.get("userType")[1]) {
        allDeals = await deal.find({ addedBy: req.token._id }).populate('posting');
        if (allDeals.length == 0) return res.status(200).send('No deals found!');
        return res.status(200).send(allDeals);
    } else if (req.token.userType == config.get("userType")[2]) {
        allDeals = await deal.find({ acceptedBy: req.token._id }).populate('posting');
        if (allDeals.length == 0) return res.status(200).send('No deals found!');
        return res.status(200).send(allDeals);

    } else if (req.token.userType == config.get("userType")[0]) {
        allDeals = await deal.find().populate('posting');
        if (allDeals.length == 0) return res.status(200).send('No deals found!');
        return res.status(200).send(allDeals);
    }
});

exports.getDeal = asyncMiddleware(async(req, res) => {
    let dealRecord = await deal.findOne({ _id: req.params.id }).populate('material');
    if (!dealRecord) return res.status(200).send('No deal found!');
    return res.status(200).send(dealRecord);
});

exports.deleteDeal = asyncMiddleware(async(req, res) => {
    let dealRecord = await deal.findOne({ _id: req.params.id }).populate('material');
    if (!dealRecord) return res.status(200).send('No deal found!');
    await deal.findByIdAndRemove(req.params.id);
    return res.status(200).send('deal deleted successfully');
});