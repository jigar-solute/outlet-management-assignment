const express = require('express');

const isAuth = require('../middleware/isAuth.js');
const adminAuth = require('../middleware/adminAuth.js');
const tempAuth = require('../middleware/tempAuth.js')

const adminController = require('../controller/admin.js');

const router = express.Router();


router.get('/outlets', tempAuth, adminAuth, adminController.getOutlets);

router.get('/outlet/:outletId', tempAuth, adminAuth, adminController.getOutlet);

router.patch('/outlets/:outletId', tempAuth, adminAuth, adminController.postChangeStatus);

router.post('/add-product', tempAuth, adminAuth, adminController.postAddProduct);

router.get('/products/aggregate-status', tempAuth, adminAuth, adminController.getCityStateProduct);



module.exports = router;