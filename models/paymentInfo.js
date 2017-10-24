let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let paymentInfo = new Schema(
    {
        userId: {type: String, required: true},
        senderName:{type:String, required:true},
        receiverName:{type:String, required:true},
        paymentAmount: {type:Number, required:true},
        paymentMethod:{type:String, required:true},
        products:[{
            id:String,
            name:String,
            quantity:Number,
            price:Number,
        }],
        impId:{type:String},
        paymentId:{type:String},
        searchAddress:{type:String, required:true},
        additionalAddress:{type:String, required:true},
        postCode:{type:String},
        email:{type:String, required:true},
        phoneNumber:{type:String, required:true},
        usedPoints:{type:Number, required:true},
        deliveryFee:{type:Number, required:true},
        paidAt:{type:Date, require:true},
        paid:{type:Boolean, default:false},
        merchantId:{type:String},
        delivered:{type:Boolean, default:false}
    }
);

let PaymentInfo = mongoose.model('PaymentInfo', paymentInfo);

module.exports = PaymentInfo;