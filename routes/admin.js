const express = require('express');

const isAuth = require('../middleware/isAuth.js');
const adminAuth = require('../middleware/adminAuth.js');
const isAuthCookie = require('../middleware/isAuthCookie.js')

const adminController = require('../controller/admin.js');

const router = express.Router();


router.get('/outlets', isAuthCookie, adminAuth, adminController.getOutlets);

router.get('/outlet/:outletId', isAuthCookie, adminAuth, adminController.getOutlet);

router.patch('/outlets/:outletId', isAuthCookie, adminAuth, adminController.postChangeStatus);

router.post('/add-product', isAuthCookie, adminAuth, adminController.postAddProduct);

router.get('/products/aggregate-status', isAuthCookie, adminAuth, adminController.getCityStateProduct);



module.exports = router;