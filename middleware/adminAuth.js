
module.exports = (req, res, next) => {
    
    if(req.userRole === 'admin'){
        next();
    }
    else{
        const error = new Error('Not Authorized');
        throw error;
    }   
}