
module.exports = (req, res, next) => {
    
    if(req.userRole === 'admin'){
        next();
    }
    else{
        const error = new Error('Not Authorized, only admin could access this route!');
        throw error;
    }   
}