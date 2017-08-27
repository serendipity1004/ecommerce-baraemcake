let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstname:{type: String},
    lastname: {type: String},
    phoneNumber:{type: String},
    points:{type:Number, default:0},
    joinedOn: {type: Date, default: Date.now()},
    searchAddress:{type:String},
    additionalAddress:{type:String},
    postalCode:{type:String},
    verified:{type: Boolean, required:true, default:false},
    verificationHash:{type:String}
});

let User = mongoose.model('User', userSchema);

module.exports = User;