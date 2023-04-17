
module.exports = (req, res, next) => {
    
    if(req.userRole === 'area-manager'){
        next();
    }
    else{
        const error = new Error('Not Authorized');
        throw error;
    }   
}