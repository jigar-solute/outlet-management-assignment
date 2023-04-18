require('dotenv').config(); //to load environment file

const Product = require('../models/product.js');
const Outlet = require('../models/outlet.js');



exports.getOutlets = async (req, res, next) => {
    const {
        name,
        city,
        state,
        status,
        timing
    } = req.query;
    const queryObject = {};

    if (name) {
        queryObject.name = {
            $regex: name,
            $options: 'i'
        };
        //so that all names eg if query is name=iphone it will return all like iphone,iphone 10 
    } //and all and also case insensitive (either small or capital both)
    if (city) { //so that if any wrong query is written, then we don't show empty array, but data based on its 
        queryObject.city = {
            $regex: city,
            $options: 'i'
        }; // previous query, and show whole data if the first qeuery itself is wrong 
    }
    if (state) {
        queryObject.state = state;
    }
    if (status) {
        queryObject.status = status;
    }
    if (timing) {
        queryObject.timing = timing;
    }
    try {
        const outlets = await Outlet.find(queryObject, {"name": 1, "state": 1, "city": 1, "_id": 0});
        if (!outlets) {
            res.json({
                message: 'No Outlet found!'
            })
        }

        res.json({
            message: 'Outlets found!',
            Outlets: outlets,
            products: outlets.products
        })

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getOutlet = async (req, res, next) => {
    const outletId = req.params.outletId;

    try {
        const outlet = await Outlet.findById(outletId)

        if (!outlet) {
            const error = new Error('Could not find Outlet');
            error.statuCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Outlet View:- ',
            user: outlet
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.postChangeStatus = async (req, res, next) => {
    const outletId = req.params.outletId;
    const updatedStatus = req.query;
    try {
        const outlet = await Outlet.findById(outletId);
        if(!outlet){
            const error = new Error('Outlet not found!');
            throw error;
        }

        outlet.status = updatedStatus.status;

        await outlet.save();
        res.json({
            message: 'Outlet status updated!',
            name: outlet.name,
            status: outlet.status
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
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
            message: "Product added Sucessfully!",
            product: product
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



exports.getCityProduct = async (req, res) => {
    const {city, state} = req.query
    try{
       
        const cityResult = await Outlet.aggregate([
          {
            $match: { city },
          },
          {
            $unwind: '$products.items',
          },
          {
            $group: {
              _id: '$products.items.status',
              product_count: {
                $sum: 1,
              },
              total_quantity: {
                $sum: '$products.items.quantity',
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ])
        const stateResult = await Outlet.aggregate([
          {
            $match: { state },
          },
          {
            $unwind: '$products.items',
          },
          {
            $addFields: {
              filter: 'city',
            },
          },
          {
            $group: {
              _id: '$products.items.status',
              product_count: {
                $sum: 1,
              },
              total_quantity: {
                $sum: '$products.items.quantity',
              },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ])     

        const allOutletResult = await Outlet.aggregate([
            {
              $unwind: '$products.items',
            },
            {
              $group: {
                _id: '$products.items.status',
                product_count: {
                  $sum: 1,
                },
                total_quantity: {
                  $sum: '$products.items.quantity',
                },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ])     
  
            if(cityResult.length === 0 && stateResult.length !== 0){
                res.json({                
                    state: state,       
                    stateResult
                });
              }    
              if(stateResult.length === 0 && cityResult.length !== 0){
                res.json({                
                    state: city,       
                    cityResult
                });
              }
           if(cityResult.length === 0 && stateResult.length === 0){
               res.json({
                allOutletResult
               })
          }
          else{
            res.json({
                city: city,
                cityResult,  
                
                state: state,       
                stateResult
            });
          }            
        
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log(err)
    }
};