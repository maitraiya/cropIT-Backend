const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const axios = require('axios');
const { posting } = require('../../../schema/posting');
const { material } = require('../../../schema/materials');
const { farmer } = require('../../../schema/farmer');
const tokenGenerator = require('../../../helpers/tokenGenerator');
const config = require('config');
exports.predict = asyncMiddleware(async(req, res) => {
    const postingId = req.params.id;
    const postingDetails = await posting.findOne({ _id: postingId });
    if (!postingDetails) return res.status(400).send("No posting found");
    const materialId = postingDetails.material;
    const materialDetails = await material.findOne({ _id: materialId });
    if (!materialDetails) return res.status(500).send("Internal server error");
    let materialName = materialDetails.name;
    const farmerDetails = await farmer.findOne({ _id: req.token._id })
    if (!farmerDetails) return res.status(500).send("Internal server error");
    let index = config.get('stubbleType').findIndex((material)=>{
        return material == materialName;
    })
    let result = await axios.post('/',{
        material:materialName,
        basePrice:config.get('stubblePrice')[index],
        landArea: farmerDetails.landArea
    })
    if(result) return res.status(200).send(result)
    else return res.status(500).send("Internal Server Error")
});