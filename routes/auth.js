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
    .isAlphanumeric()
],
 authController.signup);

 router.post('/area-manager/signup',
[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.'),
    body('password')
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric()
],
 authController.areaManagerSignup);

router.post('/login',
[
    body("email")
    .isEmail()
    .not().isEmpty(), 
    body("password")
    .notEmpty()
], 
authController.login);


module.exports = router;
