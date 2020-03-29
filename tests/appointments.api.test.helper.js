const faker = require('faker');
const clientsHelper = require('./clients.api.test.helper');

const appointments = [];

const generateRandomAppointment = async () => {
    const client = await clientsHelper.getRandomClient();

    return {
        client: client._id,
        createdAt: new Date().toISOString(),
        appointmentTime: new Date().toISOString(),
        duration: '30',
        location: {
            name: faker.company.companyName(),
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
            postalCode: faker.address.zipCode()
        }
    };
};

// Generate appointments with fake data
(async () => {
    for (let i = 0; i < 20; i++) {
        const randomAppointment = await generateRandomAppointment();
        appointments.push(randomAppointment);
    }
})();

module.exports = {
    appointments,
    generateRandomAppointment
};