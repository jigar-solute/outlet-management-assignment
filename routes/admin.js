const express = require('express');

const isAuth = require('../middleware/isAuth.js');
const adminController = require('../controller/admin.js');

const router = express.Router();


router.get('/outlets', isAuth, adminController.getOutlets);

router.get('/products', isAuth)

module.exports = router;
