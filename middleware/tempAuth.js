const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.cookies.jwtoken;
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) //It will decode and verify both
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      throw new Error('Not authenticated')
    }

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.userRole;
    next()
 
}