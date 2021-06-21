const { user } = require('../../../schema/user');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const tokenGenerator = require("../../../helpers/tokenGenerator");

const asyncMiddleware = require('../../../middleware/asyncMiddleware');

exports.sendMail = asyncMiddleware(async (req, res) => {
    let alreadyCustomer = await user.findOne({ email: req.query.email });
    if (!alreadyCustomer) return res.status(400).send("User with this email doesn't exist");
    const token = jwt.sign({ email: req.query.email }, "cropit123");
    console.log('token', token)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shivanidhe7@gmail.com',
            pass: 'shivani21698'
        }
    });

    const mailOptions = {
        from: 'cropit@gmail.com',
        to: req.query.email,
        subject: 'Password Reset Link',
        html: ` <h2>Please click on the below link to reset your password!</h2>
                <p>http://localhost:4200/auth/forgotPassword/${token}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, body) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json({ message: 'Email Sent' });
        }
    });
    // res.status(200).json(
    //     {
    //         token: token,
    //         userType: alreadyCustomer.userType.toLowerCase(),
    //     }
    // );
});

exports.reset = async (req, res, next) => {
    try {
        const userInDatabase = await user.find({
            email: req.token.email
        })
        if (userInDatabase.length < 1) {
            return res.status(400).send('User does not exists')
        }
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);
        const result = await user.findOneAndUpdate({
            email: req.token.email
        },
            {
                $set: {
                    password: hashedPassword
                }
            }
        );
        res.status(200).json({
            message: 'Password Succesfully Changed'
        });
    } catch (err) {
        res.status(404).json({
            error: err
        })
    }
}