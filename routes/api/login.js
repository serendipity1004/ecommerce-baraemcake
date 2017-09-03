const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

//Models
const User = require('../../models/user');

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

module.exports = router;