const express = require("express")
const router = express.Router();

const outletController = require("../controller/outletController.js");
const isAuth = require("../middleware/isAuth.js");
const outletManagerAuth = require('../middleware/outletManagerAuth.js')


router.post('/add-outlet', isAuth, outletManagerAuth, outletController.addOutlet);

router.post('/add-outlet-products/:productId', isAuth, outletManagerAuth, outletController.addOutletProducts);

router.post('/sell-product/:productId', isAuth, outletManagerAuth, outletController.sellProduct);

router.get('/products', isAuth, outletManagerAuth, outletController.getProducts);//no needs

router.get('/filter', isAuth, outletManagerAuth, outletController.filterProducts);


module.exports = router;