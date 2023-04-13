require('dotenv').config(); //to load environment file

const express = require('express');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');

const adminRoutes = require('./routes/admin.js');
const authRoutes = require('./routes/auth.js');

const app = express();


app.use(bodyParser.json()); // application/json           //to parse json data from incoming requests


app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);


mongoose.connect('mongodb+srv://admin-vishal:OiXu0VqZrnApu31L@cluster0.tqqbw.mongodb.net/outlet-management?w=majority')
.then(() => {
    app.listen(process.env.PORT || 3000, () => {

        console.log(`Server started at port: ${process.env.PORT || 3000}`)
    })
})
.catch(err => console.log(err))
