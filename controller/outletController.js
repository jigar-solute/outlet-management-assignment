const Product = require('../models/product')
const Outlet = require('../models/outlet')



exports.addOutlet = async (req, res, next) => {
    const outlet = new Outlet({
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        area: req.body.area,
        status: req.body.status,
        timing: req.body.timing,
        manager: req.userId,
    })
    try {
        const existingOutlet = await Outlet.find({
            manager: req.userId
        });
         console.log(existingOutlet, req.userId)
        // if (existingOutlet  ) {
        //     const error = new Error('You can add outlet only once!');
        //     throw error;
        // }
        await outlet.save()
        res.status(200).json(outlet)

    } catch (err) {
        console.log(err)
    }
}


exports.addOutletProducts = async (req, res, next) => {
    try {
        const product = await Product.findOne({
            _id: req.params.productId
        })

        const outlet = await Outlet.findOne({
            manager: req.userId
        }) //outletid
        if (outlet.products.items.length === 0) {
            outlet.products.items.push({
                productId: product._id,
                name: product.name,
                imageUrl: product.imageUrl,
                category: product.category,
                quantity: +req.query.quantity
            })
        } else {

            // Find the index of the product, if it already exists in the items array
            const index = outlet.products.items.findIndex(item => item.productId.toString() === product._id.toString());
          
            if (index >= 0) {
                // If the product exists, update the quantity
                outlet.products.items[index].quantity += +req.query.quantity;
            } else {
                 
              
            
                // If the product does not exist, add it to the items array
                outlet.products.items.push(
                  {
                    productId: product._id,
                    name: product.name,
                    quantity: +req.query.quantity,
                    imageUrl:product.imageUrl,
                    price:product.price,
                    category:product.category,
                  }      
                );
            }
        }
        await outlet.save()

        res.status(200).json(outlet)
    } catch (err) {
        console.log(err)
    }
}

exports.sellProduct = async (req, res, next) => {

    // try {

    //     const outlet = await Outlet.findOne({
    //         manager: req.userId
    //     })
    //     outlet.products.items.forEach((item) => {

    //         if (item.productId.toString() === req.params.productId.toString()) {
    //             if (req.query.quantity > item.quantity) {

    //                 const error = new Error(`you can only sell ${item.quantity} products `);
    //                 throw error;
    //             } else {
    //                 item.quantity -= +req.query.quantity;

    //                 if (item.quantity === 0) {
    //                     outlet.products.items = outlet.products.items.filter((item) => item.productId.toString() !== req.params.productId.toString());
    //                 }
    //             }
    //         } else {
    //             const error = new Error(`Product is out of stock!`);
    //             throw error;
    //         }
    //     })
    //     await outlet.save()
    //     res.status(200).json(outlet)

    // } catch (err) {
    //     console.log(err)
    // }

    try {
        const outlet = await Outlet.findOne({
          manager: req.userId
        });
      
        const productIndex = outlet.products.items.findIndex((item) => item.productId.toString() === req.params.productId.toString());
      
        if (productIndex === -1) {
          const error = new Error(`Product is out of stock!`);
          throw error;
        }
      
        const product = outlet.products.items[productIndex];
      
        if (req.query.quantity > product.quantity) {
          const error = new Error(`You can only sell ${product.quantity} products`);
          throw error;
        }
      
        product.quantity -= +req.query.quantity;
      
        if (product.quantity === 0) {
            outlet.products.items = outlet.products.items.filter((item) => item.productId.toString() !== req.params.productId.toString());
        }
      
        await outlet.save();
        res.status(200).json(outlet);
      } catch (err) {
        console.log(err);
      }
      
}
exports.setAreamanager = async (req, res, next) => {
    try {
        const outlet = await Outlet.findOne({
            manager: req.userId
        })
        outlet.areaManager = req.body.areaManager
        await outlet.save()
        res.status(200).json(outlet)
    } catch (err) {
        console.log(err)
    }

}



exports.getProducts = async (req, res) => {
    try {
        const outlet = await Outlet.findOne({ manager: req.userId });

        if (!outlet) {
          return res.status(404).json({ message: 'Outlet not found' });
        }
      
        if (!outlet.products || !outlet.products.items) {
          return res.status(404).json({ message: 'No products found for this outlet' });
        }
      
        const products = outlet.products.items.map(item => {
          return {
            productId: item.productId,
            quantity: item.quantity
          }
        });
      
        res.json({
          message: 'Products found',
          products: products
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.filterProducts = async (req, res) => {
    const {  name,maxrange,minrange,minquanity,maxquantity} = req.query;
  const queryParmsObject = {};



  if (name) {
    queryParmsObject["products.items.name"] = { $regex: name, $options: 'i' };
  }

  if (maxrange) {
    queryParmsObject["products.items.price"] = maxrange;
  }
  if (minrange) {
    queryParmsObject["products.items.price"] = minrange;
  }
  if(minquanity){

    queryParmsObject["products.items.quantity"] = minquanity; 
   }
    if(maxquantity){
    queryParmsObject["products.items.quantity"] = maxquantity;
    }

  try {
    const outlets = await Outlet.find(queryParmsObject, '-manager')
      .populate('products.items.productId', 'name price');

    res.status(200).json({
      message: 'Outlets found',
      outlets: outlets.map((outlet) => ({
        id: outlet._id,
        name: outlet.name,
        city: outlet.city,
        state: outlet.state,
        area: outlet.area,
        status: outlet.status,
        timing: outlet.timing,
        products: outlet.products.items.map((product) => ({
          id: product.productId._id,
          name: product.productId.name,
          price: product.price,
        })),
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }

  }
// exports.filterProducts = async (req, res) => {
//   const { minprice, maxprice, minquantity,maxquantity ,name} = req.query;
//   const queryParmsObject = {};
//   const product=Product.find(req.userId)
//   if (minprice) {
//     queryParmsObject["products.items.price"] = { $gte: minprice };
//   }
//   if (maxprice) {
//     if (queryParmsObject["products.items.price"]) {
//       queryParmsObject["products.items.price"].$lte = maxprice;
//     } else {
//       queryParmsObject["products.items.price"] = { $lte: maxprice };
//     }
//   }
//   if (minquantity) {
//     queryParmsObject["products.items.quantity"] = minquantity;
//   }
//   if (maxquantity) {
//     if (queryParmsObject["products.items.quantity"]) {
//       queryParmsObject["products.items.quantity"] = maxquantity;
//     } 
//   }
//   if (maxprice) {
//     if (queryParmsObject["products.items.price"]) {
//       queryParmsObject["products.items.quantity"].$lte = maxprice;
//     } else {
//       queryParmsObject["products.items.quantity"] = { $lte: maxprice };
//     }
//   }
//   if(name)
//   {
//     queryParmsObject["products.items.name"] = name;
//   }

//   try {
//     const productPriceFilter = await Outlet.find(queryParmsObject, '-manager')
//       .populate('products.items.productId', 'name price description');
//     res.status(200).json({
//       message: 'Products found',
//       products: productPriceFilter[0].products.items.map((product) => ({
//         image: product.imageUrl,
//         name: product.name,
//         price: product.price,
//        quantity: product.quantity,
//         description: product.category,
//       })),
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// };

  // exports.filterProducts = async (req, res) => {
  //   const { minprice, maxprice, quantity } = req.query;
  //   const queryParmsObject = {};
  //   if (minprice) {
  //     queryParmsObject["products.items.price"] = { $gte: minprice };
  //   }
  //   if (maxprice) {
  //     if (queryParmsObject["products.items.price"]) {
  //       queryParmsObject["products.items.price"].$lte = maxprice;
  //     } else {
  //       queryParmsObject["products.items.price"] = { $lte: maxprice };
  //     }
  //   }
  //   if (quantity) {
  //     queryParmsObject["products.items.quantity"] = quantity;
  //   }
  
  //   try {
  //     const productPriceFilter = await Outlet.find(queryParmsObject)
  //       .select("-manager") // exclude the manager field from the results
  //       .populate("products.items.productId", "name price description"); // populate the products with their name, price, and description
  
  //     res.status(200).json({
  //       message: "Products found",
  //       products: productPriceFilter[0].products.items.map((product) => ({
  //         image: product.imageUrl,
  //         name: product.name,
  //         price: product.price,
  //         description: product.category,
  //       })),
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ error: err.message });
  //   }
  // };
  

//  exports.filterProducts=async(req,res)=>{
    
// const { minPrice, maxPrice } = req.query;
//   Outlet.aggregate([
//     // Unwind the products array
//     { $unwind: '$products.items' },
//     // Lookup product information
//     {
//       $lookup: {
//         from: 'products',
//         localField: 'products.items.productId',
//         foreignField: '_id',
//         as: 'product'
//       }
//     },
//     // Unwind the product array
//     { $unwind: '$product' },
//     // Filter products by price range
//     {
//       $match: {
//         'product.price': {
//           $gte: Number(minPrice), // minimum price
//           $lte: Number(maxPrice) // maximum price
//         }
//       }
//     },
//     // Group by product
//     {
//       $group: {
//         _id: '$product._id',
//         name: { $first: '$product.name' },
//         price: { $first: '$product.price' },
//         totalQuantity: { $sum: '$products.items.quantity' }
//       }
//     },
//     // Project only required fields
//     {
//       $project: {
//         _id: 0,
//         name: 1,
//         price: 1,
//         totalQuantity: 1
//       }
//     }
//   ], (err, products) => {
//     if (err) {
//       // handle error
//       res.status(500).send(err);
//     } else {
//       // send products as response
//       res.send(products);
//     }
//   });
// }

 
  //   const {name, minprice,maxprice,quantitylimt,quantityhigh } = req.query;
  //   const queryParmsObject = {};
  //   const response={}
  //  // {price:{$gte:minprice,$lte:maxprice}}
  //     try{
  //       const productPriceFilter=await Outlet.findOne({manager:req.userId})
     
  //       if(name){
  //         queryObject.name = {$regex: name, $options: 'i'};
  //           const respo = productPriceFilter.products.items.filter((item) => item.name.toString() === name.toString());
  //           console.log(respo)
  //         //so that all names eg if query is name=iphone it will return all like iphone,iphone 10 
  //        }
  //        if(minprice){
  //         queryObject.minprice = {$regex: name, $options: 'i'};
  //         //so that all names eg if query is name=iphone it will return all like iphone,iphone 10 
          
  //     }
  //     }
  //     catch(err){
  //          console.log(err)
  //     }
    
      

  // }

  
  
 