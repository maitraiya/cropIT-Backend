const express = require('express');
const app = express();
const config = require('config');
const startup = require('./api/startup/routes/startup');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(startup);
const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`Listening on ${port}`)});

