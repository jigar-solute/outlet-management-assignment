const User = require('../models/user.js');


exports.getOutlets = async (req, res, next) => {

    try{
        const outlets = await User.find();

        res.json({
            message: 'Outelets found!',
            outlets: outlets.map(outlets => {
                return {
                    email: outlets.email,
                    role: outlets.userRole
                }
            })
        })
    } catch(err){
        console.log(err)
    }
   
}