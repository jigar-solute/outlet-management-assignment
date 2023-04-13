const express = require('express');

const router = express.Router();

const authController = require('../controller/auth.js')


router.put('/signup', authController.signup);

router.post('/login', authController.login);


module.exports = router;
