const nodemailer = require('nodemailer');
const config = require('config');

module.exports = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: config.get("user"),
        pass: config.get("password")
    },
    port: 465
});