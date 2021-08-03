const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    name: String,
    phone: Number,
    carDetails:[{
        type: Schema.Types.ObjectId,
        ref: 'ParkingLot'
    }]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Userlog', userSchema);
