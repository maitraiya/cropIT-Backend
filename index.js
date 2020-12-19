const express = require('express');
const app = express();
const config = require('config');
const startup = require('./api/startup/routes/startup');
const signup = require('./api/signup/routes/signup');
const login = require('./api/login/routes/login');
const farmer = require('./api/farmer/routes/farmer');
const company = require('./api/company/routes/company');
const material = require('./api/material/routes/material');
const posting = require('./api/posting/routes/posting');
const deal = require('./api/deal/routes/deal');
const renter = require('./api/renter/routes/renter');
const machine = require('./api/machine/routes/machine');
const rented = require('./api/rented/routes/rented');
const scheduler = require('./helpers/backgroundChecker');
const pricePredictor = require('./api/pricePrediction/routes/pricePrediction');

const mongoose = require('mongoose');
const helmet = require('helmet');
const db = require('./database/db');
const cors = require('./helpers/cors');

app.use(express.json({ limit: '50mb' }));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(startup);
app.use(cors);

app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/farmer', farmer);
app.use('/api/company', company);
app.use('/api/material', material);
app.use('/api/posting', posting);
app.use('/api/deal', deal);
app.use('/api/renter', renter);
app.use('/api/machine', machine);
app.use('/api/rented', rented);
app.use('/api/pricePredictor', pricePredictor);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening on ${port}`) });