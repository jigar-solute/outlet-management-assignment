
const User = require('../models/user.js');
const Product = require('../models/product.js');
const Outlet = require('../models/outlet.js');



exports.getOutlets = async (req, res, next) => {
    const { name, city, state, status, timing } = req.query;
    const queryObject = {};
    
    if(name){
        queryObject.name = {$regex: name, $options: 'i'};
        //so that all names eg if query is name=iphone it will return all like iphone,iphone 10 
    }                                                      //and all and also case insensitive (either small or capital both)
    if(city){                             //so that if any wrong query is written, then we don't show empty array, but data based on its 
        queryObject.city = {$regex: city, $options: 'i'};         // previous query, and show whole data if the first qeuery itself is wrong 
    }
    if(state){
        queryObject.state = state;
    }
    if(status){
        queryObject.status = status;
    }
    if(timing){
        queryObject.timing = timing;
    }
    
    try{
        const outlets = await Outlet.find(queryObject);   //replace with outlet model 
        if(!outlets){
            res.json({ message: 'No Outlet found!'})     
        }
        
        res.json({
            message: 'Outlets found!',
            Outlets: outlets.map(p => {
                return {
                    name: p.name,
                    city: p.city,
                    status: p.status
                }
            }),
            products: outlets.products          
        })
    } catch(err){
        console.log(err)
    }
}


exports.getOutlet = async (req, res, next) => {
    const outletId = req.params.outletId;
     
    try {
        const outlet = await Outlet.findById(outletId)  //replace with outlet model 
       
    if(!outlet){
        const error = new Error('Could not find Outlet');
        error.statuCode=404;
        throw error;
    }
     
    res.status(200).json({
        message: 'Outlet View:- ',
        user: outlet
    })
    } catch (err) {
        console.log(err)
    }
    
}

exports.postChangeStatus = async (req, res, next) => {
    const outletId = req.params.outletId;
    const updatedStatus = req.query;

    const outlet = await Outlet.findById(outletId)
    outlet.status = updatedStatus.status;

    await outlet.save();
    res.json({
        message: 'Outlet status updated!',
        name: outlet.name,
        status: outlet.status
    })
}


exports.postAddProduct = async (req, res, next) => {
    const name = req.body.name;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const category = req.body.category;
    const description = req.body.description;

    const product = new Product({
        name: name,
        imageUrl: imageUrl,
        price: price,
        category: category,
        description: description
    });

    try {
       await product.save();   

       res.status(201).json({
        message:"Product added Sucessfully!",
        product: product
    });
    } catch (err) {
        console.log(err)
    }
}


// exports.getProduct = async (req, res, next) => {
//     try{
//     const productId = req.params.productId;
//     const outlet = await Outlet.find()
//     const product = await Product.findOne({
//         _id: productId
//     })
//     const index = outlet.map(p => {
//         return p.products.items.findIndex(item => item.productId.toString() === product._id.toString());
//     })
//     console.log(index)
// } catch(err){
//     console.log(err)
// }
// }