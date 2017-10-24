const express = require('express');
const router = express.Router();

const PaymentInfo = require('../../models/paymentInfo');
const Product = require('../../models/product');

router.post('/orders',(req, res) => {
    console.log('api requested')
    PaymentInfo.find({}, (err, paymentInfoResult) => {

        console.log(paymentInfoResult)
        res.json({data:paymentInfoResult})
    })
});

router.post('/order/details', (req, res) => {
    let id = req.body.id;

    console.log('id');
    console.log(id);

    PaymentInfo.findById(id, [
        'senderName',
        'receiverName',
        'paymentAmount',
        'paymentMethod',
        'products',
        'searchAddress',
        'additionalAddress',
        'postCode',
        'email',
        'phoneNumber',
    ], (err, result)=>{
        if(err) throw err;

        res.json({result});
    })
});

router.post('/order/update/status', (req, res) => {
    let body = req.body;
    let ids = body.ids;
    let status = body.status === 'delivered';

    console.log('body');
    console.log(body)

    let promises = [];

    for(let i = 0; i < ids.length; i ++) {
        let curId = ids[i];
        let updatePromise = new Promise((resolve, reject) => {
            PaymentInfo.findByIdAndUpdate(curId, {delivered: status}, (err, paymentResult) => {
                if (err) throw err;

                resolve();
            })
        });

        promises.push(updatePromise);

    }

    Promise.all(promises).then(() => {
        res.json({done:true})
    })

});

module.exports = router;