const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkSchema = new Schema({
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
});

module.exports = mongoose.model('Check', checkSchema);