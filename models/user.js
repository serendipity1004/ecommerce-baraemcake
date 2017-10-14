let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName:{type: String},
    lastName: {type: String},
    phoneNumber:{type: String},
    points:{type:Number, default:0},
    joinedOn: {type: Date, default: Date.now()},
    searchAddress:{type:String, required:true},
    additionalAddress:{type:String},
    postCode:{type:String},
    verified:{type: Boolean, required:true, default:false},
    verificationHash:{type:String},
    authority:{type:String, default:'customer'}
});

let User = mongoose.model('User', userSchema);

module.exports = User;