const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
    name: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    ownerList: [{
        type: Schema.Types.ObjectId,
        ref: "Ownerlog"
    }]
});

module.exports = mongoose.model('City', citySchema);