const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    createdAt: String,
    appointmentTime: String,
    duration: String,
    location: {
        name: String,
        streetAddress: String,
        city: String,
        country: String,
        postalCode: String
    }
});

appointmentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);