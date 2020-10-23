const jwt = require("jsonwebtoken");
module.exports = function(usertemp) {
    const token = jwt.sign({ _id: usertemp.id, userType: usertemp.userType }, "cropit123");
    return token;
}