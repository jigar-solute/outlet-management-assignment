
const User = require('../models/user.js');
const Product = require('../models/product.js');


exports.getOutlets = async (req, res, next) => {
    const { email, name } = req.query;
    const queryObject = {};
    
    if(email){                             //so that if any wrong query is written, then we don't show empty array, but data based on its 
        queryObject.email = email;         // previous query, and show whole data if the first qeuery itself is wrong 
    }

    // if(name){
    //     queryObject.name = {$regex: name, $options: 'i'};  //so that all names eg if query is name=iphone it will return all like iphone,iphone 10 
    // }                                                      //and all and also case insensitive (either small or capital both)

    try{
        const outlets = await User.find(queryObject);   //replace with outlet model 
        if(!outlets){
            res.json({ message: 'No Outlet found!'})
        }

        res.json({
            message: 'Outlets found!',
            Outlets: outlets.map(outlets => {
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


exports.getOutlet = async (req, res, next) => {
    const outletId = req.params.outletId;

    try {
        const user = await User.findById(outletId);   //replace with outlet model 

    if(!user){
        const error = new Error('Could not find Outlet');
        error.statuCode=404;
        throw error;
    }

    res.status(200).json({
        message: 'Outlet View:- ',
        user: user
    })
    } catch (err) {
        console.log(err)
    }
    
}

exports.postAddProduct = async (req, res, next) => {
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const category = req.body.category;
    const quantity = req.body.quantity;
    const description = req.body.description;

    const product = new Product({
        name: name,
        imageUrl: imageUrl,
        price: price,
        category: category,
        quantity: quantity,
        description: description,
        owner: user._id
    });

    try {
       await product.save();        

       const user = await User.findById(user._id);
       user.products.push(product);
       await user.save();

       res.status(201).json({
        message:"Product added Sucessfully!",
        product: product,
        owner:{_id: user._id,name:user.email, role: user.userRole}
    });
    } catch (err) {
        console.log(err)
    }


}