const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res) => {

});

router.get('/details', (req, res) => {
    let prodId = req.query.id;
    let cart = req.session.cart;
    let curQuantity;
    if(cart[prodId] === undefined || cart[prodId] === null){
        curQuantity = 1;
    }else {
        curQuantity = cart[prodId];
    }

    Product.findById(prodId, (err, prodResult) => {
        if(err) throw err;

        res.render('./shop/details/details', {
            slideRevolution: false,
            product:prodResult,
            quantity:curQuantity,
            js:['/shop/details/details.js'],
            css:['/shop/details/details.css']
        })
    });
});

module.exports = router;