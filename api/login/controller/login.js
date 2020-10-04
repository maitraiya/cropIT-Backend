const { user } = require('../../../schema/user');

const { validateLogin } = require('../../../helpers/validations');

const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require('config');
const asyncMiddleware = require('../../../middleware/asyncMiddleware');

exports.login = asyncMiddleware(async(req, res) => {

    const loginInfo = req.body;
    const { error } = validateLogin(loginInfo);
    if (error) return res.status(400).send(error.message);
    let alreadyCustomer = await user.findOne({ email: loginInfo.email });
    if (!alreadyCustomer) return res.status(400).send("User with this email doesn't exist");
    const validPass = await bcrypt.compare(loginInfo.password, alreadyCustomer.password);
    if (!validPass) return res.status(400).send('Invalid Password');
    console.log('before', alreadyCustomer._id);
    const usertemp = new user({
        _id: alreadyCustomer._id,
        userType: alreadyCustomer.userType
    });
    console.log('after', usertemp);
    const token = usertemp.generateAuthToken();
    res.header('cropit-auth-token', token).status(200).send('Login successfull!');
});