const express = require('express');

const isAuth = require('../middleware/isAuth.js')

const router = express.Router();


router.get('/outlets', isAuth,(req, res, next)=>{

});

router.get('/products', )

module.exports = router;
