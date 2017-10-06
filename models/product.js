let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema(
    {
        name: {type: String, required: true},
        group: {type: String, required: true},
        category: [String],
        price: {type: Number, required: true},
        largeImagePath: {type: String, required: true},
        detailsImagePath: [String],
        stock: {type: Number, required: true},
        main: {type: Boolean},
        points: {type:Number, default: 10},
        overviewComments: {type: String, required: true},
        detailedDescription: {type: String, required: true},
        additionalInfo: {
            quantity: Number,
            weight: Number,
        }
    });

let Product = mongoose.model('Product', productSchema);

module.exports = Product;