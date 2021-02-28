const config = require('config');
const { deal } = require("../../../schema/deal");
const { posting } = require("../../../schema/posting");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const moment = require('moment');

exports.add = asyncMiddleware(async (req, res) => {

    let postingDetails = posting.findOne({ _id: req.body.postingId });
    if (!postingDetails) res.status(404).json("No posting found!");
    let expiryDate = postingDetails.expiryDate;
    if (moment(expiryDate).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD"))
        return res.status(400).json("Posting already expired!");
    let dealObj = new deal({
        posting: req.body.posting,
        addedBy: req.body.addedBy,
        acceptedBy: req.body.acceptedBy
    });
    await dealObj.save();
    return res.status(200).json("Deal added successfully.");
});


exports.getAllDeals = asyncMiddleware(async (req, res) => {
    let allDeals;
    if (req.token.userType == config.get("userType")[1]) {
        allDeals = await deal.find({ addedBy: req.token._id }).populate('posting');
        return res.status(200).json(allDeals);
    } else if (req.token.userType == config.get("userType")[2]) {
        allDeals = await deal.find({ acceptedBy: req.token._id })
            .populate(
                {
                    path: 'posting',
                    populate: { path: 'addedBy', model: 'company', populate: { path: 'user' } },
                }
            )
            .populate(
                {
                    path: 'posting',
                    populate: { path: 'material' },
                }
            )
        return res.status(200).json(allDeals);

    } else if (req.token.userType == config.get("userType")[0]) {
        allDeals = await deal.find().populate('posting');
        return res.status(200).json(allDeals);
    }
});

exports.getDeal = asyncMiddleware(async (req, res) => {
    let dealRecord = await deal.findOne({ _id: req.params.id }).populate('material');
    return res.status(200).json(dealRecord);
});

exports.deleteDeal = asyncMiddleware(async (req, res) => {
    let dealRecord = await deal.findOne({ _id: req.params.id }).populate('material');
    if (!dealRecord) return res.status(200).json('No deal found!');
    await deal.findByIdAndRemove(req.params.id);
    return res.status(200).json('deal deleted successfully');
});