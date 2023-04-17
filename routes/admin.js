const express = require('express');

const isAuth = require('../middleware/isAuth.js');
const adminAuth = require('../middleware/adminAuth.js');

const adminController = require('../controller/admin.js');

const router = express.Router();


router.get('/outlets', isAuth, adminAuth, adminController.getOutlets);

router.get('/outlets/:outletId', isAuth, adminAuth, adminController.getOutlet);

router.patch('/outlets/:outletId', isAuth, adminAuth, adminController.postChangeStatus);

router.post('/add-product', isAuth, adminAuth, adminController.postAddProduct);

// router.get('/products/:productId', isAuth, adminAuth, adminController.getProduct)


module.exports = router;
