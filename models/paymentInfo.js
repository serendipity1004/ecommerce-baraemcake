let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let paymentInfo = new Schema(
    {
        amountLiable:{type:Number, required:true},
        discountOrNot:{type: Boolean, default:false},
        discountCode:{type: Schema.Types.ObjectId},
        discountReflectedPay:{type: Number},
        payer:{type:Schema.Types.ObjectId, required:true},
    }
);

let PaymentInfo = mongoose.model('PaymentInfo', paymentInfo);

module.exports = PaymentInfo;