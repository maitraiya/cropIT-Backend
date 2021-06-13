const { user } = require('../../../schema/user');
const { company } = require('../../../schema/company');
const { farmer } = require('../../../schema/farmer');
const { renter } = require('../../../schema/renter');

const { validateUser, validateFarmer, validateCompany } = require('../../../helpers/validations');
const config = require('config');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const asyncMiddleware = require('../../../middleware/asyncMiddleware');
const tokenGenerator = require("../../../helpers/tokenGenerator");


exports.register = asyncMiddleware(async (req, res) => {
    if (!("user" in req.body && "company" in req.body || ("user" in req.body && "farmer" in req.body) || ("user" in req.body && "renter" in req.body) || ("user" in req.body && "admin" in req.body)))
        return res.status(404).send("Invalid request")

    const userInfo = req.body.user;
    const { error } = validateUser(req.body.user);
    if (error) return res.status(400).send(error.message);
    let alreadyCustomer = await user.findOne({ $or: [{ email: userInfo.email }, { adhaar: userInfo.adhaar }] });
    if (alreadyCustomer) return res.status(400).send("Email/Adhaar already registered");

    let usertemp = new user({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city,
        adhaar: userInfo.adhaar,
        profile: userInfo.profile
    });

    const salt = await bcrypt.genSalt(10);
    usertemp.password = await bcrypt.hash(usertemp.password, salt);

    if ("company" in req.body) {
        const companyInfo = req.body.company;
        const { error } = validateCompany(req.body.company);
        if (error) return res.status(400).send(error.message);
        usertemp.userType = config.get('userType')[1];
        await usertemp.save();
        let companytemp = new company({
            domain: companyInfo.domain,
            material: companyInfo.material,
            user: usertemp._id
        });
        await companytemp.save();
        const token = tokenGenerator({ id: usertemp._id, userType: usertemp.userType });
        // res.header('cropit-auth-token', token).send("User registered successfully");
        res.status(200).json({
            message: 'User registered successfully',
            'cropit-auth-token': token,
            userType: 'company'
        });

    } else if ("farmer" in req.body) {
        const farmerInfo = req.body.farmer;
        const { error } = validateFarmer(req.body.farmer);
        if (error) return res.status(400).send(error.message);
        usertemp.userType = config.get('userType')[2];
        await usertemp.save();
        let farmertemp = new farmer({
            landArea: farmerInfo.landArea,
            material: farmerInfo.material,
            user: usertemp._id
        });
        await farmertemp.save();
        const token = tokenGenerator({ id: usertemp._id, userType: usertemp.userType });
        // res.header('cropit-auth-token', token).send("User registered successfully");
        res.status(200).json({
            message: 'User registered successfully',
            'cropit-auth-token': token,
            userType: 'farmer'
        });
    } else if ("renter" in req.body) {
        usertemp.userType = config.get('userType')[3];
        await usertemp.save();
        let renterTemp = new renter({
            machines: null,
            user: usertemp._id
        });
        await renterTemp.save();
        const token = tokenGenerator({ id: usertemp._id, userType: usertemp.userType });
        // res.header('cropit-auth-token', token).send("User registered successfully");
        res.status(200).json({
            message: 'User registered successfully',
            'cropit-auth-token': token,
            userType: 'renter'
        });
    } else if ("admin" in req.body) {
        usertemp.userType = config.get('userType')[0];
        await usertemp.save();
        const token = tokenGenerator({ id: usertemp._id, userType: usertemp.userType });
        res.status(200).json({
            message: 'User registered successfully',
            'cropit-auth-token': token,
            userType: 'admin'
        });
    }
});