const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const User = require('../models/user');
const PaymentInfo = require('../models/paymentInfo');

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

router.get('/cart', (req, res, next) => {
    if(req.isAuthenticated()){
        console.log('authenticated');
        next();
    }else{
        console.log('not authenticated');
        res.redirect('/login');
    }
}, (req, res) => {
    let cart = req.session.cart;

    let cartKeys = Object.keys(cart);

    Product.find({_id: {$in:cartKeys}}).lean().exec(function (err, productResults) {
        if(err) throw err;

        for(let index in productResults){
            let curProduct = productResults[index];

            curProduct['quantity'] = cart[curProduct._id];
        }

        User.findById(req.user, (err, userResult) => {
            if(err) throw err;

            console.log(productResults)

            res.render('./shop/cart/cart' , {
                cartProducts:productResults,
                user:userResult,
                postCode:true,
                payModule:true,
                js:['/shop/cart/cart.js'],
                css:['/shop/cart/cart.css']
            })
        });
    })
});

router.get('/cart/paid', (req, res) => {
    let id = req.query.id;

    PaymentInfo.findById(id, (err, paymentInfoResult) => {
        if(err) throw err;

        let products = paymentInfoResult.products;
        let productQuant = {};
        let productIds = [];

        for(let i =0; i < products.length; i ++){
            productIds.push(products[i].id);
            productQuant[products[i].id] = products[i].quantity;
        }

        Product.find({_id:{$in:productIds}}, (err, productResult) => {
            if(err) throw err;

            for(let i =0; i < productResult.length; i++){
                productResult[i]['quantity'] = productQuant[productResult[i]._id]
            }

            res.render('./shop/cart/paid/paid', {
                js:['/shop/cart/paid/paid.js'],
                css:['/shop/cart/paid/paid.css'],
                cartProducts:productResult,
                paymentInfo:paymentInfoResult
            })
        })
    })
});

module.exports = router;