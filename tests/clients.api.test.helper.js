/* Temporary JS file for generating fake data  */

const faker = require('faker');

let clients = [];

const generateRandomClient = () => {
    return {
        userName: faker.internet.userName(),
        password: faker.internet.password(),
        image: faker.image.avatar(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: {
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
            postalCode: faker.address.zipCode()
        },
        phoneNumber: faker.phone.phoneNumber(),
        email: faker.internet.email(),
        appointments: []
    };
};

// Generate clientsApiTestHelper with fake data
for (let i = 0; i < 20; i++) {
    clients.push(generateRandomClient());
}

module.exports = {
    clients,
    generateRandomClient
};