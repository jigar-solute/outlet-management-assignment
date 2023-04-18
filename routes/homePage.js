const express = require('express');

const router = express.Router();

const Product = require('../models/product.js');


router.get('/', async (req, res, next) => {

    const products = await Product.find();

    res.json({
        message: 'Products found',
        products: products.map(p => {
            return {
                name: p.name,
                imageUrl: p.imageUrl,
                price: p.price,
                category: p.category,
                description: p.description
            }
        })
    })
});

module.exports = router;