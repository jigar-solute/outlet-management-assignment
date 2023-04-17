const express = require('express');
const { body } = require('express-validator')

const router = express.Router();

const authController = require('../controller/auth.js')


router.post('/signup',
[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.'),
    body('password')
    .trim()
    .isLength({ min: 5 })
],
 authController.signup);

router.post('/login', authController.login);


module.exports = router;
