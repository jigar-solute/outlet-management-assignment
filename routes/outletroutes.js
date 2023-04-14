const express = require("express")
const outlateroutes = express.Router()
const {addoutlateStore,addtocart} = require("../controller/outletController")
var bodyParser = require("body-parser");


//outletmodel routers
outlateroutes.use(bodyParser.urlencoded({ extended: false }));
outlateroutes.use(bodyParser.json());

outlateroutes.post("/addoutlet", addoutlateStore);
outlateroutes.post("/addtocart",addtocart)

module.exports = outlateroutes