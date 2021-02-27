const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const { PythonShell } = require('python-shell');
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
    materialName = "wheat";
    const farmerDetails = await farmer.findOne({ _id: req.token._id })
    if (!farmerDetails) return res.status(500).send("Internal server error");
    let index = config.get('stubbleType').findIndex((material)=>{
        return material == materialName;
    })
    
    let options = {
        mode: 'text',
        pythonPath: __dirname + '\\venv\\Scripts\\python.exe',
        scriptPath: __dirname, //If you are having python_test.py script in same folder, then it's optional. 
        pythonOptions: ['-u'], // get print results in real-time 
        args: [materialName, config.get('stubblePrice')[index],farmerDetails.landArea]
    };
    PythonShell.run('pricePrediction.py', options, function(err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected  
        //during execution of script. 
        console.log('result: ', result[result.length - 1]);
        res.send(result[result.length - 1])
    });
});