const Product = require('../models/product');
const Outlet = require('../models/outlet');
const AreaManager = require('../models/areaManager');



exports.addOutlet = async (req, res, next) => {
  const {
    name,
    city,
    state,
    area,
    status,
    timings
  } = req.b
  
  timings.open = Math.floor(timings.open);    //to convert decimal to integer
  timings.close = Math.floor(timings.close);


  try {
    const areaManager = await AreaManager.findOne({ //find area manager with same city to push outlet Ids
      city: req.body.city
    })
    const existingOutlet = await Outlet.findOne({
      manager: req.userId
    });

    if (!areaManager) {
      const error = new Error(`Area manager of city: ${req.body.city} Not found, Please add new area manager! `);
      throw error;
    }

    if (existingOutlet) {
      const error = new Error('You can add outlet only once!');
      throw error;
    }

    if(timings.close < timings.open)
    {
      const error = new Error('Close time should be greater than open time or Timings must be in 24 hour format');
      throw error
    }

    if(timings.close === 0 || timings.open === 0){
        const error = new Error('Please enter a valid time (only in integer and greater than 0)')
        throw error;
    }


    const outlet = new Outlet({
      name: name,
      city: city,
      state: state,
      area: area,
      status: status,
      timings: {
        open: timings.open,
        close: timings.close
      },
      manager: req.userId,
      areaManager: areaManager._id
    })

    await outlet.save()
    areaManager.outletIds.push(outlet._id);
    await areaManager.save();
    res.status(200).json(outlet)

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.addOutletProducts = async (req, res, next) => {
  try {
    console.log('REQ user ID: ', req._id)
    const product = await Product.findOne({
      _id: req.params.productId
    })

    const outlet = await Outlet.findOne({
      manager: req.userId
    })
    if (!outlet) {
      const error = new Error('Outlet not found!');
      throw error;
    }
    if (!product) {
      const error = new Error('Prodcuct not found!');
      throw error;
    }

    if (outlet.products.items.length === 0) {
      outlet.products.items.push({
        productId: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        category: product.category,
        quantity: +req.query.quantity
      })
    } else {


      const index = outlet.products.items.findIndex(item => item.productId.toString() === product._id.toString());

      if (index >= 0) {
        outlet.products.items[index].quantity += +req.query.quantity;
        outlet.products.items[index].status = 'available'
      } else {

        outlet.products.items.push({
          productId: product._id,
          name: product.name,
          quantity: +req.query.quantity,
          imageUrl: product.imageUrl,
          price: product.price,
          category: product.category,
        });
      }
    }
    await outlet.save()

    res.status(200).json(outlet)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.sellProduct = async (req, res, next) => {

  try {
    const outlet = await Outlet.findOne({
      manager: req.userId
    });

    if (!outlet) {
      const error = new Error('Outlet not found!');
      throw error;
    }

    const productIndex = outlet.products.items.findIndex((item) => item.productId.toString() === req.params.productId.toString());

    if (productIndex === -1) {
      const error = new Error(`Product is not found`);
      throw error;
    }


    const product = outlet.products.items[productIndex];
    if (product.quantity === 0) {
      const error = new Error(`Product is out of stock`);
      throw error;
    }

    if (req.query.quantity > product.quantity) {
      const error = new Error(`You can only sell ${product.quantity} products`);
      throw error;
    }


    product.quantity -= +req.query.quantity;


    if (product.quantity === 0) {
      product.status = 'out of stock';
    }


    await outlet.save();
    res.status(200).json(outlet);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}


exports.filterProducts = async (req, res) => {
  const {
    name,
    minPrice,
    maxPrice,
    minQuantity,
    maxQuantity
  } = req.query;

  try {
    const outlet = await Outlet.findOne({
      manager: req.userId
    })

    if (name) {
      res.status(200).json({
        message: 'Outlet Found',
        products: outlet.products.items.filter(product => {
          return product.name.split('+').join('') === name //updated
        })
      })
    } else {
      res.status(200).json({
        message: 'Outlets found',
        products: outlet.products.items.filter(product => {
          if (Object.keys(req.query).length === 0) { //req.query = {}
            return product;
          }
          return ((product.price <= maxPrice && product.price >= minPrice) || (product.quantity <= maxQuantity && product.quantity >= minQuantity))
        }),

      });
    }

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}