let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let deliveryAddress = new Schema(
    {
        frontendId:{type:String, require:true},
        userId: {type: Schema.Types.ObjectId, required:true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        address: {type: String, required: true},
        postCode: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        paymentId: {type: Schema.Types.ObjectId},
        paid: {type: Boolean, default: false},
        addedDate: {type: Date, default: Date.now()},
        products: [
            {
                productId: {type: Schema.Types.ObjectId},
                quantity: {type: Number}
            }
        ]
    });

let DeliveryAddress = mongoose.model('DeliveryAddress', deliveryAddress);

module.exports = DeliveryAddress;