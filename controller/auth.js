const bcrypt = require('bcryptjs');

const User = require('../models/user.js');


exports.signup = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const userRole = req.body.userRole;


    try {
        const hashedPwd = await bcrypt.hash(password, 12)
    
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