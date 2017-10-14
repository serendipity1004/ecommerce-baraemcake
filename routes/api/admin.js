const express = require('express');
const router = express.Router();

const PaymentInfo = require('../../models/paymentInfo');

router.post('/orders',(req, res) => {
    console.log('api requested')
    PaymentInfo.find({}, (err, paymentInfoResult) => {

        console.log(paymentInfoResult)
        res.json({data:paymentInfoResult})
    })
});

module.exports = router;