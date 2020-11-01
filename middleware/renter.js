const config = require("config");

module.exports = function(req, res, next) {
    if (!(req.token.userType === config.get("userType")[3])) {
        return res.status(400).send('Not a priviliged user');
    }
    next();
}