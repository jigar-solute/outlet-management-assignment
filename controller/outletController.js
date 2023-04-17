const Product = require('../models/product');
const Outlet = require('../models/outlet');
const AreaManager = require('../models/areaManager');



exports.addOutlet = async (req, res, next) => {
    
    try {
      const areaManager = await AreaManager.findOne({  //find area manager with same city to push outlet Ids
        city: req.body.city
      })
        const existingOutlet = await Outlet.findOne({
            manager: req.userId
        });

        if (existingOutlet) {
            const error = new Error('You can add outlet only once!');
            throw error;
        }

        const outlet = new Outlet({
          name: req.body.name,
          city: req.body.city,
          state: req.body.state,
          area: req.body.area,
          status: req.body.status,
          timing: req.body.timing,
          manager: req.userId,
          areaManager: areaManager._id
      })

        await outlet.save()
        areaManager.outletIds.push(outlet._id);
        await areaManager.save();
        res.status(200).json(outlet)
        
    } catch (err) {
        console.log(err)
    }
}


// exports.addOutletProducts = async (req, res, next) => {
//     try {
//         const product = await Product.findOne({
//             _id: req.params.productId
//         })

//         const outlet = await Outlet.findOne({
//             manager: req.userId
//         }) 
//         if (outlet.products.items.length === 0) {
//           outlet.products.items.push(
//             {
//               productId: product._id,
//               name: product.name,
//               quantity: +req.query.quantity,
//               imageUrl:product.imageUrl,
//               price:product.price,
//               category:product.category,
//             })
//         } else {

            
//             const index = outlet.products.items.findIndex(item => {     // Find the index of the product
//               item.productId.toString() === product._id.toString()
//             });  
          
//             if (index >= 0) {               
//                 outlet.products.items[index].quantity += +req.query.quantity;   // If the product exists, update the quantity
//             } else {
              
//               outlet.products.items.push(
//                 {
//                   productId: product._id,
//                   name: product.name,
//                   quantity: +req.query.quantity,
//                   imageUrl:product.imageUrl,
//                   price:product.price,
//                   category:product.category,
//                 })
//             }
//         }
//         await outlet.save()

//         res.status(200).json(outlet)
//     } catch (err) {
//         console.log(err)
//     }
// }

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
              outlet.products.items[index].status = 'available'
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

    try {
        const outlet = await Outlet.findOne({
          manager: req.userId
        });
      
        const productIndex = outlet.products.items.findIndex((item) => item.productId.toString() === req.params.productId.toString());
      
        if (productIndex === -1) {
          const error = new Error(`Product is not found`);
          throw error;
        }
       
      
        const product = outlet.products.items[productIndex];
        if(product.quantity === 0){
          const error = new Error(`Product is out of stock`);
          throw error;
        }
      
        if (req.query.quantity > product.quantity) {
          const error = new Error(`You can only sell ${product.quantity} products`);
          throw error;
        }
        
        
        product.quantity -= +req.query.quantity;
        
      
        if(product.quantity === 0){
          product.status = 'out of stock'
        }
      
      
        await outlet.save();
        res.status(200).json(outlet);
      } catch (err) {
        console.log(err);
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
  

  // exports.filterProducts = async (req, res) => {
  //   const {  name,maxrange,minrange,minquanity,maxquantity} = req.query;
  // const queryParmsObject = {};



  // if (name) {
  //   queryParmsObject["products.items.name"] = { $regex: name, $options: 'i' };
  // }

  // if (maxrange) {
  //   queryParmsObject["products.items.price"] = maxrange;
  // }
  // if (minrange) {
  //   queryParmsObject["products.items.price"] = minrange;
  // }
  // if(minquanity){

  //   queryParmsObject["products.items.quantity"] = minquanity; 
  //  }
  //   if(maxquantity){
  //   queryParmsObject["products.items.quantity"] = maxquantity;
  //   }

  // try {
  //   const outlets = await Outlet.find(queryParmsObject, '-manager')
  //     .populate('products.items.productId', 'name price');

  //   res.status(200).json({
  //     message: 'Outlets found',
  //     outlets: outlets.map((outlet) => ({
  //       id: outlet._id,
  //       name: outlet.name,
  //       city: outlet.city,
  //       state: outlet.state,
  //       area: outlet.area,
  //       status: outlet.status,
  //       timing: outlet.timing,
  //       products: outlet.products.items.map((product) => ({
  //         id: product.productId._id,
  //         name: product.productId.name,
  //         price: product.price,
  //       })),
  //     })),
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ error: err.message });
  // }

  // }

  exports.filterProducts = async (req, res) => {
   const {  name, minPrice, maxPrice, minQuantity, maxQuantity} = req.query;
   const queryParamsObject = {};

  

  if (name) {
    queryParamsObject["products.items.price.name"] = { $regex: name, $options: 'i' };
  }                   //key                           //value


    if (minPrice) {
      queryParamsObject['products.items.price'] = { $gte: minPrice };
    }
    if (maxPrice) {
      queryParamsObject['products.items.price'] = { $lte: maxPrice };
    }
  
  if(minQuantity){

    queryParamsObject["products.items.quantity"] = {$gte: minQuantity}; 
   }
    if(maxQuantity){
    queryParamsObject["products.items.quantity"] = {$lte: maxQuantity};
    }

  try {
    const outlet = await Outlet.find({
      manager: req.userId,
      ...queryParamsObject,
    })
     .populate('products.items.productId', 'name price');//outlet
     console.log(outlet)

    res.status(200).json({
      message: 'Outlets found',
      outlets: outlet.map((outlet) => ({
        products: outlet.products.items.map((product) => ({
          id: product.productId._id,
          name: product.productId.name,
          price: product.price
        })),
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }

  }