/* Temporary JS file for generating fake data  */

const faker = require('faker');

let clients = [];

// Generate clients with fake data 
for (let i = 0; i < 5; i++) {
    const client = {
        id: faker.random.uuid(),
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
        date: faker.date.future(),
    };

    clients.push(client);
}

module.exports = clients; 