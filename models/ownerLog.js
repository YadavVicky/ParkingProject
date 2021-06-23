const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ownerSchema = new Schema({
    name: String,
    phone: String,
	parkingname: {
		type: String,
		default: null
	},
	spots: {
		type: String,
		default: null
	},
	address: {
		type: String,
		default: null
	},
    geometry: {
        type: {
            type: String,
			default: 'Point'
        },
        coordinates: {
            type: [Number],
			default: [null, null]
        }
    },
    carDetails:[{
        type: Schema.Types.ObjectId,
        ref: 'ParkingLot'
    }],
    
});

ownerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Ownerlog', ownerSchema);
