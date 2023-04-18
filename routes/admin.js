const express = require('express');

const isAuth = require('../middleware/isAuth.js');
const adminAuth = require('../middleware/adminAuth.js');

const adminController = require('../controller/admin.js');

const router = express.Router();


router.get('/outlets', isAuth, adminAuth, adminController.getOutlets);

router.get('/outlet/:outletId', isAuth, adminAuth, adminController.getOutlet);

router.patch('/outlets/:outletId', isAuth, adminAuth, adminController.postChangeStatus);

router.post('/add-product', isAuth, adminAuth, adminController.postAddProduct);

router.get('/products/status/city/:city', isAuth, adminAuth, adminController.getCityProduct);

router.get('/products/status/state/:state', isAuth, adminAuth, adminController.getStateProduct);





module.exports = router;