const express = require("express")
const authRoutes = express.Router()
const { signup,signin ,addoutlateProduct} = require("../controller/outletController")
var bodyParser = require("body-parser");

//signup one function
//outletmodel
authRoutes.use(bodyParser.urlencoded({ extended: false }));
authRoutes.use(bodyParser.json());

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);

module.exports = authRoutes