const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const User = require('../models/user');
const PaymentInfo = require('../models/paymentInfo');

router.get('/', (req, res) => {

    res.render('admin/admin', {
        layout:'metronic',
        css:['/admin/admin.css'],
        js:['/admin/admin.js']
    })
});

module.exports = router;