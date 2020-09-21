const mongoose = require('mongoose');
const config = require('config');

module.exports = mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Database connected Successfully');
}).catch(error => {
    console.log(error);
});