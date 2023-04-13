const bcrypt = require('bcryptjs');

const User = require('../models/user.js');


exports.signup = async (req, res, next) => {

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

    
        res.status(200).json({
         message: 'User Found',  
         userId: user._id.toString(),
         userRole: user.userRole
        });

    } catch (err) {
        console.log(err)
    }
}