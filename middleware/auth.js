const config = require('config');
const jwt = require('jsonwebtoken');

const auth = function(req, res, next) {
    const token = req.header('cropit-auth-token');
    if (!token) return res.status(400).send('Token not found');
    try {
        const decoded = jwt.verify(token, config.get('PrivateKey'));
        req.token = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token ');
    }
}

module.exports = auth;