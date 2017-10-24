const express = require('express');
const router = express.Router();

//Model
const Product = require('../../models/product');
const User = require('../../models/user');
const PaymentInfo = require('../../models/paymentInfo');

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

router.post('/details/update', (req, res) => {
    let updateItem = req.body.productDetails;
    let id = req.body.id;

    Product.findByIdAndUpdate(id, updateItem, {new: true}, (err, result) => {
            res.json(result)
        })
});

router.post('/cart/req_payment_info', (req, res) => {
    let productKeys = Object.keys(req.session.cart);
    let pointsUsed = req.body.pointsUsed;

    Product.find({_id: {$in: productKeys}}, (err, productResults) => {
        if (err) throw err;

        let totalPrice = 0;

        for(let i = 0; i < productResults.length; i ++){
            let curProduct = productResults[i];

            totalPrice += curProduct.price * req.session.cart[curProduct._id];
        }

        totalPrice -= pointsUsed;

        if(totalPrice < 35000){
            totalPrice += 3000;
        }

        // let merchant_uid = req.user;
        User.findById(req.user, (err, userResult) => {
            if(err) throw err;

            let buyer_email = userResult.email;
            let buyer_name = userResult.firstName.trim() + userResult.lastName.trim();
            let buyer_tel = userResult.phoneNumber;
            let buyer_addr = userResult.searchAddress + userResult.additionalAddress;
            let buyer_postcode = userResult.postCode;

            // let receiverName = req.body.receiverName;
            // let searchAddress = req.body.searchAddress;
            // let additionalAddress = req.body.additionalAddress;
            // let email = req.body.email;
            // let postCode = req.body.postCode;
            // let phoneNumber = req.body.phoneNumber;
            // let deliveryFee = req.body.deliveryFee;
            //
            // let paymentInfo = new PaymentInfo({
            //     user:req.user,
            //     receiverName:receiverName,
            //     paymentAmount:totalPrice,
            //     searchAddress:searchAddress,
            //     additionalAddress:additionalAddress,
            //     postCode:postCode,
            //     email:email,
            //     phoneNumber:phoneNumber,
            //     usedPoints:pointsUsed,
            //     deliveryFee:deliveryFee
            // });
            //
            // paymentInfo.save((err) => {
            //     if(err) throw err;

                res.json({totalPrice, buyer_email, buyer_name, buyer_tel, buyer_addr, buyer_postcode})

            // });

        })

    });

});

router.post('/cart/payment_success', (req, res) => {
    let body = req.body;

    let userId = req.user;
    let merchantId = req.merchantId;
    let paidAmount = parseInt(body.paidAmount);
    let impId = body.impId;
    let paymentId = body.paymentId;
    let cart = req.session.cart;
    let pointsUsed = parseInt(body.pointsUsed);
    let receiverName = body.receiverName;
    let searchAddress = body.searchAddress;
    let additionalAddress = body.additionalAddress;
    let email = body.email;
    let phoneNumber = body.phoneNumber;
    let cartKeys = Object.keys(cart);
    let deliveryFee = parseInt(body.deliveryFee);
    let postCode = body.postCode;
    let senderName = body.senderName;
    let paymentMethod = body.paymentMethod;

    Product.find({_id:{$in:cartKeys}}, (err, productResult) => {
        if(err) throw err;

        let products = [];
        let points = 0;
        let calculatedTotal = 0;

        for(let i = 0; i < productResult.length; i ++){
            let curProduct = productResult[i];

            points += curProduct.price * (curProduct.points / 100) * cart[curProduct._id];

            products.push({
                id:curProduct._id,
                name:curProduct.name,
                quantity:cart[curProduct._id],
                price:curProduct.price
            });

            calculatedTotal += parseInt(curProduct.price) * parseInt(cart[curProduct._id]);

        }

        calculatedTotal += deliveryFee;
        calculatedTotal -= pointsUsed;

        //MUST CHANGE -- test purpose

        if(calculatedTotal === paidAmount){

            let paymentInfo = new PaymentInfo({
                userId:userId,
                paymentMethod:paymentMethod,
                senderName:senderName,
                paymentAmount:paidAmount,
                products:products,
                impId:impId,
                paymentId:paymentId,
                receiverName:receiverName,
                searchAddress:searchAddress,
                additionalAddress:additionalAddress,
                email:email,
                phoneNumber:phoneNumber,
                usedPoints:pointsUsed,
                deliveryFee:deliveryFee,
                postCode:postCode,
                paidAt:Date.now()
                // merchantId:merchantId
            });

            paymentInfo.save((err) => {
                if(err) throw err;

                User.findOneAndUpdate({_id:req.user}, {$inc:{points:points}}, (err, userResult) => {
                    if(err) throw err;

                    console.log('all good');
                    req.session.cart ={};
                    res.json({success:true, paymentInfoId:paymentInfo._id})
                })
            })
        }else {
            res.json({success:false, detail:'결제 금액이 잘못되었습니다'})
        }
    })
});

router.post('/cart/request_payment_info/naver', (req, res) => {
    let ipAddress = '';
    let cart = req.session.cart;

    let cartKeys = Object.keys(cart);

    let naverProducts = [];
    let price = 0;

    User.findById(req.user, (err, userResult) => {
        if(err) throw err;

        Product.find({_id:{$in:cartKeys}}, (err, result) => {
            if(err) throw err;

            for(let i =0; i < result.length; i ++){
                let curProd = result[i];
                let productTemplate =
                    {
                        id:curProd._id,
                        name:curProd.name,
                        basePrice:curProd.price,
                        taxType:'FREE',
                        quantity:cart[curProd._id],
                        infoUrl:`${ipAddress}/shop/details/${curProd._id}`,
                        imageUrl:`${ipAddress}/images/ricecakes/cropped/${curProd.name}/1.jpg`,
                        shipping:{
                            groupId:'1',
                            method:'Delivery',
                            baseFee:3000,
                            feeType:'CONDITIONAL_FREE',
                            feePayType:'PREPAYED'
                        }
                    };
                naverProducts.push(productTemplate);
                price += parseInt(curProd.price) * cart[curProd._id]
            }

            if(price < 35000){
                price += 3000;
            }

            let template =
                {
                    pg: 'nverco',
                    pay_method:'card',
                    merchant_uid:'merchant_' + new Date().getTime(),
                    name:'naver payment',
                    amount:price,
                    buyer_email:userResult.email,
                    buyer_name:userResult.lastName.trim() + userResult.firstName.trim(),
                    buyer_tel:userResult.phoneNumber,
                    buyer_addr:userResult.searchedAddress.trim() + userResult.additionalAddress.trim(),
                    buyer_postcode:userResult.postCode,
                    naverProducts:naverProducts
                }

                res.json({template})
        });
    })
});

module.exports = router;