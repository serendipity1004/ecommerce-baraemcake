const express = require('express');
const router = express.Router();

router.post('/cart/add', (req, res) => {
    let item = req.body.itemId;
    let quantity = parseInt(req.body.itemQuantity);
    let sessionCart = req.session.cart;
    let exists = false;

    let cartKeys = Object.keys(sessionCart);

    for(let i = 0; i < cartKeys.length; i ++){
        let curItem = cartKeys[i];
        if(curItem === item){
            sessionCart[curItem] = parseInt(sessionCart[curItem]) + parseInt(quantity);
            exists = true;
            break;
        }
    }
    if(!exists){
        sessionCart[item] = quantity;
    }

    req.session.cart = sessionCart;

    res.json(sessionCart);
});

module.exports = router;