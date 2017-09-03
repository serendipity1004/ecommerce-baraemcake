const path = require('path');
const Product = require('../models/product');

const fillCakeData = () => {
    for (let i = 1; i < 13; i++){
        let name = `하늘채${i}`;
        let group = `group ${i % 4}`;
        let price = i* 10000;
        let largeImagePath = `/images/haneulcake${i}.jpg`;
        let detailsImagePath = [`/images/haneulcake${i}.jpg`];

        let product = new Product({
            name,
            group,
            price,
            largeImagePath,
            detailsImagePath,
            stock:9999,
            overviewComments:'overview comments',
            detailedDescription: 'detailed description'
        });

        product.save((err, result) => {
            console.log(err)
            if(err) throw err;

        })
    }
};

module.exports = {
    fillCakeData
};