const path = require('path');
const Product = require('../models/product');
const url = require('url');
const fs = require('fs');

const fillCakeData = () => {
    let imgPath = path.resolve(__dirname, '..', 'public', 'images', 'ricecakes', 'cropped');

    let eachProductPromises = [];

    fs.readdir(imgPath, (err, files) => {
        if (err) throw err;

        let fileName = '';

        files.forEach((file) => {
            let filePath = path.resolve(imgPath, file);
            fileName = file;
            let promises = [];


            fs.readdir(filePath, (err, imgFiles) => {
                if (err) throw err;

                let detailsImagePath = [];

                imgFiles.forEach((image) => {
                    let promise = new Promise((resolve, reject) => {
                        let detailspath = `/images/ricecakes/cropped/${file}/${image}`;
                        console.log('resolve path')
                        console.log(detailspath)
                        resolve(detailspath);
                    });
                    promises.push(promise);
                });

                Promise.all(promises).then((paths) => {
                    console.log('paths');
                    console.log(paths);
                    let name = file;
                    console.log('printing name')
                    console.log(name)
                    let group = 'group 1';
                    let price = '20000';
                    let detailsImagePath = paths;
                    let largeImagePath = paths[0];
                    let overviewComments = 'test';
                    let detailedDescription = 'test';

                    let product = new Product({
                        name,
                        group,
                        price,
                        stock: 9999,
                        largeImagePath,
                        detailsImagePath,
                        overviewComments,
                        detailedDescription,
                    });

                    product.save((err) => {
                        console.log('saving')
                        console.log(product.name)
                        console.log(err)
                        if (err) throw err;
                    });
                })
            });

        });
    })
};

module.exports = {
    fillCakeData
};