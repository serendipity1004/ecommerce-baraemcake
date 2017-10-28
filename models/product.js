let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema(
    {
        name: {type: String, required: true},
        group: {type: String, required: true},
        category: [String],
        price: {type: Number, required: true},
        origPrice: {type: Number},
        largeImagePath: {type: String, required: true},
        detailsImagePath: [String],
        stock: {type: Number, required: true},
        main: {type: Boolean},
        points: {type: Number, default: 10},
        overviewComments: {type: String, required: true},
        detailedDescription: {type: String, required: true},
        additionalInfo: {
            quantity: Number,
            weight: Number,
        },
        nutritionalInfo: {

            // name: String,
            // type: String,
            // producer: String,
            // bestBefore: String,
            // weightAndQuant: String,
            // materials: String,
            // showOrNot: {
            //     nutrition: String,
            //     genetic:String,
            //     specialUse:String,
            //     imported:String
            // },
            // phone:String
        },
        order: {type: Number}
    });

let Product = mongoose.model('Product', productSchema);

module.exports = Product;