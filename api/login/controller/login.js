const { user } = require('../../../schema/user');
const { company } = require('../../../schema/company');
const { farmer } = require('../../../schema/farmer');

const { validateLogin } = require('../../../helpers/validations');
const tokenGenerator = require("../../../helpers/tokenGenerator");

const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require('config');
const asyncMiddleware = require('../../../middleware/asyncMiddleware');

exports.login = asyncMiddleware(async (req, res) => {
    let userTemp = {};
    const loginInfo = req.body;
    const { error } = validateLogin(loginInfo);
    if (error) return res.status(400).send(error.message);
    let alreadyCustomer = await user.findOne({ email: loginInfo.email });
    if (!alreadyCustomer) return res.status(400).send("User with this email doesn't exist");
    const validPass = await bcrypt.compare(loginInfo.password, alreadyCustomer.password);
    if (!validPass) return res.status(400).send('Invalid Password');
    if (alreadyCustomer.userType == config.get("userType")[0]) {
        userTemp = {
            _id: alreadyCustomer._id,
            userType: alreadyCustomer.userType
        };
    }
    if (alreadyCustomer.userType == config.get("userType")[1]) {
        let companyDetails = await company.findOne({ user: alreadyCustomer._id })
        if (!companyDetails) return res.status(500).send("Internal Server Error!")
        userTemp = {
            _id: companyDetails._id,
            userType: alreadyCustomer.userType
        }
    }
    if (alreadyCustomer.userType == config.get("userType")[2]) {
        let farmerDetails = await farmer.findOne({ user: alreadyCustomer._id })
        if (!farmerDetails) return res.status(500).send("Internal Server Error!")
        userTemp = {
            id: farmerDetails._id,
            userType: alreadyCustomer.userType
        }
    }
    const token = tokenGenerator(userTemp);
    res.status(200).json({ message: 'Login successfull!', token: token });
});