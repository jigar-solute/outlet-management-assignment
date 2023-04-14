const express = require('express');
const monogoose = require('mongoose');
const outlateRouter = require('./routes/outletmanager');
const app = express();
const CONNECTION = "mongodb+srv://admin-vishal:OiXu0VqZrnApu31L@cluster0.tqqbw.mongodb.net/outlet-management?w=majority"

app.use('/auth',outlateRouter)
monogoose.connect(CONNECTION).then
    (() => {
        console.log("connected to database")

    }).catch((err) => {
        console.log("connection failed", err)
    })

app.listen(process.env.PORT || 3000, () => {

    console.log(`Server test at port: ${process.env.PORT || 3000}`)
})