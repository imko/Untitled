/* Temporary JS file for generating fake data  */

const faker = require('faker');

let clientsApiTestHelper = [];

const generateRandomClient = () => {
    return {
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
    };
};

// Generate clientsApiTestHelper with fake data
for (let i = 0; i < 20; i++) {
    clientsApiTestHelper.push(generateRandomClient());
}

module.exports = {
    clients: clientsApiTestHelper,
    generateRandomClient
};