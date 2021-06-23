const mongoose = require('mongoose');
const Check = require('../models/check');

//mongodb code
mongoose.connect('mongodb+srv://myParking:2QZXG7JuJyKLb8CM@myparking.fjy4n.mongodb.net/myParking?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'));
db.once("open", () => {
    console.log("Database connected");
})


const arr = [
    {
        name: "My parking",
        geometry: { type: 'Point', coordinates: [25.269257, 82.999125]}
    }, {
        name: "Your parking",
        geometry: { type: 'Point', coordinates: [25.297506, 82.989505]}

    }, {
        name: "We parking",
        geometry: { type: 'Point', coordinates: [25.291143, 82.998266]}
    }, {
        name: "I parking",
        geometry: { type: 'Point', coordinates: [25.285555, 82.988474]}

    }]

const SeedDB = async () => {
    await Check.deleteMany({});
    Check.insertMany(arr)
        .then(res => {
            console.log("Data Added")
        })
        .catch(e => {
            console.log(e)
        })
}

SeedDB();
