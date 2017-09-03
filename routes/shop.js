const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res) => {

});

router.get('/details', (req, res) => {
    let prodId = req.query.id;
    console.log('prodid')
    console.log(prodId);

    console.log('valid?')
    mongoose.Types.ObjectId.isValid(prodId)

    Product.findById(prodId, (err, prodResult) => {
        if(err) throw err;

        res.render('./shop/details/details', {
            slideRevolution: false,
            product:prodResult,
            js:['/shop/details/details.js'],
            css:['/shop/details/details.css']
        })
    });
});

module.exports = router;