require('dotenv').config(); //to load environment file

const jwt = require('jsonwebtoken');
const mac = require('address')

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error('Not Authenticated..!!');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1] //To get 'Bearer Token' and split with whitespace so to get - 'Bearer' + 'token' separately
    let decodedToken; //Bearer is not needed, iys just conevntion to write it for token for json data
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) //It will decode and verify both
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not Authenticated..!');
        error.statusCode = 401;
        throw error;
    }

    // const macd =  mac.mac((err, mac) => {
    //     return mac
    //   })


   if(mac.ip() !== decodedToken.mac){
    const error = new Error('Not same device');
    throw error;
   }

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.userRole;
    next();
}