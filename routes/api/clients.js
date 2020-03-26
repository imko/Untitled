const express = require('express');
const router = express.Router();
const faker = require('faker');
let clients = require('../../Clients');

router.get('/', (req, res) => {
    res.json(clients);
});

router.post('/', (req, res) => {
    const body = req.body;

    if (!body.firstName || !body.lastName || !body.address || !body.phoneNumber || !body.email) {
        return res.status(400).send({ error: 'Missing information' });
    }

    const client = {
        id: faker.random.uuid(),
        image: faker.image.avatar(),
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phoneNumber: body.phoneNumber,
        email: body.email,
        date: new Date().toISOString()
    };

    clients.push(client);

    return res.status(201).end();
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const client = clients.find(client => client.id === id);

    if (client) {
        return res.json(client);
    }

    return res.status(400).send({ error: 'Invalid ID' });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, address, phoneNumber, email } = req.body;
    let client = clients.find(client => client.id === id);

    if (client) {
        client.firstName = firstName || client.firstName;
        client.lastName = lastName || client.lastName;
        client.address = address || client.address;
        client.phoneNumber = phoneNumber || client.phoneNumber;
        client.email = email || client.email;
        client.date = new Date().toISOString();

        return res.status(200).end();
    }

    return res.status(400).send({ error: 'Invalid ID' });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const found = clients.some(client => client.id === id);

    if (found) {
        clients = clients.filter(client => client.id !== id);

        return res.status(200).end();
    }

    return res.status(400).send({ error: 'Invalid ID' });
});

module.exports = router; 