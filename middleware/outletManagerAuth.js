
module.exports = (req, res, next) => {
    
    if(req.userRole === 'outlet-manager'){
        next();
    }
    else{
        const error = new Error('Not Authorized, only outlet manager could access this route!');
        throw error;
    }   
}