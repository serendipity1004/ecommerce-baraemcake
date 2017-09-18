const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const User = require('../models/user');

const saltRounds = 10;

router.get('/', (req, res) => {
    let errMessage = req.flash('error');

    console.log(errMessage)

    res.render('./login/login', {
        error: errMessage,
        postCode:true,
        js:['/login/login.js'],
        css: ['/login/login.css']
    })
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: '로그인 정보가 잘못되었습니다'
}));

router.post('/logout', (req, res)=>{
    req.logout();
    res.redirect('/')
});

router.post('/new', (req, res) => {
    console.log(req.body)
    let lastName = req.body['register-form-last-name'];
    let firstName = req.body['register-form-first-name'];
    let email = req.body['register-form-email'];
    let searchAddress = req.body['register-form-address'];
    let additionalAddress = req.body['register-form-additional-address'];
    let postCode = req.body['register-form-post-code'];
    let phoneNumber = req.body['register-form-phone'];
    let password = req.body['register-form-password'];

    console.log('received')

    bcrypt.hash(email + Date.now(), 10, (err, verificationHash) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if(err) {
                throw err;
            }

            let user = new User({
                lastName,
                firstName,
                email,
                searchAddress,
                additionalAddress,
                postCode,
                phoneNumber,
                password:hash,
                verificationHash
            });

            let urlEncodedVerificationHash = encodeURIComponent(verificationHash);

            user.save((err, userSaveResult) => {
                if(err){
                    console.log(err);
                    throw err;
                }

                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port:465,
                    secure:true,
                    auth:{
                        user:'customer.service@baraemcake.com',
                        pass:'inscapbaby12#$'
                    }
                });

                let verificationUrl = `http://localhost:3000/login/verify_email/${urlEncodedVerificationHash}`;

                let mailOptions = {
                    from: '"Baraem Customer Service" <DO_NOT_REPLY@baraemcake.com>',
                    to:email,
                    subject: '바램떡 이메일 확인 입니다',
                    html: '<strong>바램</strong>' +
                    `<p>링크를 눌러서 이메일을 확인 해주세요</p> <p>${verificationUrl}</p>`
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if(err) {
                        throw err;
                    }

                    console.log('sent')

                    res.redirect('/')
                })
            })
        })
    })
});

router.get('/verify_email/:hash', (req, res) => {
    let verificationHash = req.params.hash;

    User.findOneAndUpdate({verificationHash}, {verified:true, verificationHash:''}, (err, result) => {
        if(err) throw err;

        res.render('./login/verifyEmail/verifyEmail', {

        })
    })
});

router.get('/profile', (req, res, next)=>{
    if(req.isAuthenticated()){
        next()
    }else {
        res.redirect('/login')
    }
},(req, res) => {

    User.findById(req.user, '_id firstName lastName email searchAddress additionalAddress phoneNumber points',(err, result) => {
        if(err) throw err;

        res.render('./login/profile/profile', {
            user:result
        })
    })
});



passport.serializeUser(function(userId, done) {
    done(null, userId);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user._id);
    });
});

module.exports = router;