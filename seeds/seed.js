const mongoose = require('mongoose');
const Cities = require('../models/cities');

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
        name: 'Noida',
        geometry: { type: 'Point', coordinates: [77.32,28.57]}

    }, {
        name: 'Ghaziabad',
        geometry: { type: 'Point', coordinates: [77.41667,28.66667]}

    }, {
        name: 'Varanasi',
        geometry: { type: 'Point', coordinates: [83.00611,25.30694]},
        check: ['60bb1c57d77a6401c96f7955','60bb1c57d77a6401c96f7956','60bb1c57d77a6401c96f7957','60bb1c57d77a6401c96f7958']
    }, {
        name: 'Delhi',
        geometry: { type: 'Point', coordinates: [77.21667,28.66667]}

    }]

const SeedDB = async () => {
    await Cities.deleteMany({});
    Cities.insertMany(arr)
        .then(res => {
            console.log("Data Added")
        })
        .catch(e => {
            console.log(e)
        })
}

SeedDB();
