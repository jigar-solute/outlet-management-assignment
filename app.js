require('dotenv').config(); //to load environment file

const express = require('express');
const bodyParser = require('body-parser')

const app = express();



app.use(bodyParser.json()); // application/json           //to parse json data from incoming requests



app.listen(process.env.PORT || 3000, () => {

    console.log(`Server started at port: ${process.env.PORT || 3000}`)
})