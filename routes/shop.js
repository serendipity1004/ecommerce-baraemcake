const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res) => {

    Product.find({}, (err, productResult) => {
        if(err) throw err;

        res.render('./shop/shop', {
            products:productResult,
            css: ['/shop/shop.css'],
            js: ['/shop/shop.js']
        })
    })
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

router.get('/cart', (req, res) => {
    let cart = req.session.cart;

    let cartKeys = Object.keys(cart);

    Product.find({_id: {$in:cartKeys}}).lean().exec(function (err, productResults) {
        if(err) throw err;

        for(let index in productResults){
            let curProduct = productResults[index];

            curProduct['quantity'] = cart[curProduct._id];
        }
        res.render('./shop/cart/cart' , {
            cartProducts:productResults,
            postCode:true,
            payModule:true,
            js:['/shop/cart/cart.js'],
            css:['/shop/cart/cart.css']
        })
    })

    // Product.find({_id: {$in:cartKeys}}, (err, result) => {
    //     if(err)throw err;
    //
    //     let productResults = result.toObject();
    //
    //     for(let index in productResults){
    //         let curProduct = productResults[index];
    //
    //         curProduct['quantity'] = cart[curProduct._id];
    //     }
});

module.exports = router;