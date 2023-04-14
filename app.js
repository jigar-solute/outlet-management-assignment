const express = require('express');
const monogoose = require('mongoose');
const authRoutes = require('./routes/authroutes');
const outlateroutes = require('./routes/outletroutes');
const app = express();
const CONNECTION = "mongodb+srv://admin-vishal:OiXu0VqZrnApu31L@cluster0.tqqbw.mongodb.net/outlet-management?w=majority"

app.use('/auth',authRoutes)
app.use('/outlate',outlateroutes)
monogoose.connect(CONNECTION).then
    (() => {
        console.log("connected to database")

    }).catch((err) => {
        console.log("connection failed", err)
    })

app.listen(process.env.PORT || 3000, () => {

    console.log(`Server test at port: ${process.env.PORT || 3000}`)
})