const express = require('express');
const app = express();
const config = require('config');
const startup = require('./api/startup/routes/startup');
const signup = require('./api/signup/routes/signup');
const login = require('./api/login/routes/login');
const farmer = require('./api/farmer/routes/farmer');
const company = require('./api/company/routes/company');

const mongoose = require('mongoose');
const helmet = require('helmet');
const db = require('./database/db');
const cors = require('./helpers/cors');

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(startup);
app.use(cors);

app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/farmer', farmer);
app.use('/api/company', company);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening on ${port}`) });