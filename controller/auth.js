const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user.js');


exports.signup = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed.');
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }
    const email = req.body.email;
    const password = req.body.password;
    const userRole = req.body.userRole;

    try {      
        const hashedPwd = await bcrypt.hash(password, 12);
         


        const user = new User({
          email: email,
          password: hashedPwd,
          userRole: userRole
        });

        const existingAdmin = await User.findOne({
          userRole: 'admin'
        })

        if(existingAdmin && user.userRole === 'admin'){
          const error = new Error('Admin exists already!')
          throw error;
        }

        const result = await user.save();
        
        
        res.status(201).json({
          message: 'User Created Successfully..!!',
          userId: result._id
        });
      } catch (err){
        console.log(err)
      }
}



exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({
            email: email
          })
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
          }
        
         const isEqual = await bcrypt.compare(password, user.password);
        
        if (!isEqual) {
         const error = new Error('Wrong password!');
         error.statusCode = 401;
         throw error;
       }  

       const token = jwt.sign({
        email: user.email,
        userId: user._id.toString(),
        userRole: user.userRole
      },
      'somesupersecretsecret', {
        expiresIn: '1h'
      }
    );
    
        res.status(200).json({
         token: token,
         message: 'User Found',  
         userId: user._id.toString(),
         userRole: user.userRole
    });

    } catch (err) {
        console.log(err)
    }
}