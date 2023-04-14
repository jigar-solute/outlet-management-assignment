const express = require('express');
const { body } = require('express-validator')

const router = express.Router();

const authController = require('../controller/auth.js')


router.put('/signup',
[
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return User.findOne({
            email: value
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        });
    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({ min: 5 })
],
 authController.signup);

router.post('/login', authController.login);


module.exports = router;
