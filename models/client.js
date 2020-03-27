const mongoose = require('mongoose');
const config = require('../utils/config');

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err.message));

const clientSchema = new mongoose.Schema({
    image: String,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        streetAddress: String,
        city: String,
        country: String,
        postalCode: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: String
});

clientSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Client', clientSchema); 