const express = require("express");
const router = express.Router();

const outletController = require("../controller/outletController.js");
const isAuth = require("../middleware/isAuth.js");
const outletManagerAuth = require('../middleware/outletManagerAuth.js');
const isAuthCookie = require('../middleware/isAuthCookie.js')


router.post('/add-outlet', isAuthCookie, outletManagerAuth, outletController.addOutlet);

router.post('/add-outlet-products/:productId', isAuthCookie, outletManagerAuth, outletController.addOutletProducts);

router.post('/sell-product/:productId', isAuthCookie, outletManagerAuth, outletController.sellProduct);

router.get('/filter', isAuthCookie, outletManagerAuth, outletController.filterProducts);


module.exports = router;