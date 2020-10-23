const config = require('config');
const _ = require("lodash");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const { material } = require("../../../schema/materials");

exports.add = asyncMiddleware(async(req, res) => {
    if (req.body.material.length > 0) {
        let addedRecords = [];
        await Promise.all(req.body.material.map(async(data) => {
            data = data.toLowerCase();
            let materialExist = await material.findOne({ name: data });
            if (!materialExist) {
                let materialObj = new material({
                    name: data
                });
                let added = await materialObj.save();
                addedRecords.push(added.name);
            }
        }));
        if (addedRecords.length > 0) {
            addedRecords = addedRecords.join(',');
            return res.status(200).send(`Records ${addedRecords} added succesfully`);
        } else return res.status(500).send('No records added');
    } else {
        return res.status(400).send('No material found');
    }
});

exports.update = asyncMiddleware(async(req, res) => {
    if (req.body.material) {
        let materialExist = await material.findOne({ _id: req.params.id });
        if (materialExist) {
            let materialObj = {
                name: req.body.material.toLowerCase()
            };
            await material.findOneAndUpdate({ _id: materialExist._id }, materialObj);
            return res.status(200).send(`Material updated succesfully`);
        } else return res.status(500).send('No materials to update');
    } else return res.status(500).send('No materials to update');
});

exports.getAllMaterials = asyncMiddleware(async(req, res) => {
    let allMaterials = await material.find();
    if (allMaterials.length == 0) return res.status(200).send('No material record found!');
    return res.status(200).send(allMaterials);
});
exports.getMaterial = asyncMiddleware(async(req, res) => {
    let materialRecord = await material.findOne({ _id: req.params.id });
    if (!materialRecord) return res.status(200).send('No material record found!');
    return res.status(200).send(materialRecord);
});
exports.deleteMaterial = asyncMiddleware(async(req, res) => {
    let materialRecord = await material.findOne({ _id: req.params.id });
    if (!materialRecord) return res.status(200).send('No material record found!');
    await material.findByIdAndRemove(req.params.id);
    return res.status(200).send('Material record deleted successfully');
});