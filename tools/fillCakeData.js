const path = require('path');
const Product = require('../models/product');

const fillCakeData = () => {
    // for (let i = 1; i < 13; i++){
    //     let name = `하늘채${i}`;
    //     let group = `group ${i % 4}`;
    //     let price = i* 10000;
    //     let largeImagePath = `/images/haneulcake${i}.jpg`;
    //     let detailsImagePath = [`/images/haneulcake${i}.jpg`];
    //
    //     let product = new Product({
    //         name,
    //         group,
    //         price,
    //         largeImagePath,
    //         detailsImagePath,
    //         stock:9999,
    //         overviewComments:'overview comments',
    //         detailedDescription: 'detailed description'
    //     });
    //
    //     product.save((err, result) => {
    //         console.log(err)
    //         if(err) throw err;
    //
    //     })
    // }

    let name = '인절미';
    let engName = 'injulmi';
    let group = `group 1`;
    let price = 20000;
    let largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    let detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];
    let overviewComments = 'overview comments';
    let detailedDescription = 'detailed description';

    let product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save((err) => {
        console.log(err)
    })

    name = '콩쑥깨떡';
    engName = 'kong_sook_gae'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save()


    name = '경단';
    engName = 'kyungdan'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save()


    name = '모찌'
    engName = 'mocchi'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save()


    name = '미니 모찌'
    engName = 'mochi_small'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save()


    name = '오디 모찌'
    engName = 'odi_mochi'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save()

    name = '오메기'
    engName = 'omaegi'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        overviewComments,
        detailedDescription
    })

    product.save()


    name = '수수경단'
    engName = 'soo_soo_kyungdan'
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        detailedDescription
    })
    product.save()


    name = '쑥왕찹살떡'
    engName = 'sook_wang_chapsal';
    largeImagePath = `/images/ricecakes/cropped/${engName}.png`;
    detailsImagePath = [`/images/ricecakes/cropped/${engName}_2.png`];

    product = new Product({
        name,
        group,
        price,
        stock: 9999,
        largeImagePath,
        detailsImagePath,
        detailedDescription,
        overviewComments
    });

    product.save((err) =>{
        console.log(err)
    })


};

module.exports = {
    fillCakeData
};