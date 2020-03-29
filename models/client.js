const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    password: String,
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
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    date: String,
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment'
        }
    ]
});

clientSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    }
});

module.exports = mongoose.model('Client', clientSchema); 