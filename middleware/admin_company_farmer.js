const config = require("config");

module.exports = function(req, res, next) {
    if (!(req.token.userType === config.get("userType")[0] || req.token.userType === config.get("userType")[1] || req.token.userType === config.get("userType")[2])) {
        return res.status(400).send('Not a priviliged user');
    }
    next();
}