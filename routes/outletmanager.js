const express = require("express")
const outlateRouter = express.Router()
const { signup,signin } = require("../controller/outletController")
var bodyParser = require("body-parser");

//signup one function
//outletmodel
outlateRouter.use(bodyParser.urlencoded({ extended: false }));
outlateRouter.use(bodyParser.json());

outlateRouter.post("/signup", signup);
outlateRouter.post("/signin", signin);
module.exports = outlateRouter