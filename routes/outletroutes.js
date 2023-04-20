const express = require("express");
const router = express.Router();

const outletController = require("../controller/outletController.js");
const isAuth = require("../middleware/isAuth.js");
const outletManagerAuth = require('../middleware/outletManagerAuth.js');
const tempAuth = require('../middleware/tempAuth.js')


router.post('/add-outlet', tempAuth, outletManagerAuth, outletController.addOutlet);

router.post('/add-outlet-products/:productId', tempAuth, outletManagerAuth, outletController.addOutletProducts);

router.post('/sell-product/:productId', tempAuth, outletManagerAuth, outletController.sellProduct);

router.get('/filter', tempAuth, outletManagerAuth, outletController.filterProducts);


module.exports = router;