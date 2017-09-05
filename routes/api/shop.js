const express = require('express');
const router = express.Router();

//Model
const Product = require('../../models/product');

router.post('/cart/add', (req, res) => {
    let item = req.body.itemId;
    let quantity = parseInt(req.body.itemQuantity);
    let sessionCart = req.session.cart;
    let exists = false;

    let cartKeys = Object.keys(sessionCart);

    for (let i = 0; i < cartKeys.length; i++) {
        let curItem = cartKeys[i];
        if (curItem === item) {
            sessionCart[curItem] = parseInt(sessionCart[curItem]) + parseInt(quantity);
            exists = true;
            break;
        }
    }
    if (!exists) {
        sessionCart[item] = quantity;
    }

    req.session.cart = sessionCart;

    res.json(sessionCart);
});

router.post('/cart/retrieve', (req, res) => {
    let cart = req.session.cart;
    let prodId = Object.keys(cart);

    Product.find({_id: {$in: prodId}}, (err, result) => {
        if (err) throw err;

        let resultToSend = [];

        for (let i = 0; i < result.length; i++) {
            resultToSend[i] = result[i];
            resultToSend[i].cartQuantity = parseInt(resultToSend[i].cartQuantity, 10);
        }

        console.log(resultToSend)

        res.json({cart: resultToSend})
    });
});

router.post('/cart/remove_product', (req, res) => {
    let productId = req.body.productId;
    console.log(req.body)
    console.log(productId)
    let cart = req.session.cart;
    console.log('received')

    delete cart[productId];

    res.json({cart})
});

module.exports = router;