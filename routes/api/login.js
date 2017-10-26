const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

//Models
const User = require('../../models/user');
const PaymentInfo = require('../../models/paymentInfo');

const saltRounds = 10;

router.post('/new/verify', (req, res) => {
    let email = req.body.email;

    User.find({email}, (err, result)=>{
        if(err) throw err;

        console.log(result.length)
        console.log(result)
        if(result.length > 0){
            res.json({exists:true})
        }else {
            res.json({exists:false})
        }
    })
});

router.get('/profile/get/orders', (req, res) => {
    PaymentInfo.find({userId:req.user}, (err, paymentInfo) => {
        console.log('payment info')
        console.log(paymentInfo)
        res.json({data:paymentInfo})
    })
});

module.exports = router;