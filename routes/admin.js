const express = require('express');

const isAuth = require('../middleware/isAuth.js');
const adminController = require('../controller/admin.js');

const router = express.Router();

// router.get('/outlets', isAuth, adminController.getOutlets);  //isAuth later

router.get('/outlets',  adminController.getOutlets);

router.get('/outlets/:outletId', adminController.getOutlet);

router.post('/outlets/:outletId', adminController.postChangeStatus);


router.post('/add-product', adminController.postAddProduct);

router.get('/products')

module.exports = router;
