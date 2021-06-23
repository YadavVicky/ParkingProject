const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingLotSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "Ownerlog"
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Userlog"
    },
    vehicle: {
        type: String
    },
    dob:{
        type: Number
    },
    slot: {
        type: Number
    },
    cost: {
        type: Number,
        default: 100
    },
    timeIn:{
        type: Number
    },
    timeOut: {
        type: Number
    }
});

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
