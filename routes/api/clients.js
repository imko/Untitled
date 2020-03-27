const express = require('express');
const router = express.Router();
const faker = require('faker');
const Client = require('../../models/client');

router.get('/', (req, res) => {
    Client
        .find({})
        .then(clients => res.json(clients))
        .catch(err => console.log(err));
});

router.post('/', (req, res, next) => {
    const body = req.body;

    if (!body.firstName || !body.lastName || !body.address || !body.phoneNumber || !body.email) {
        return res.status(400).send({ error: 'Missing information' });
    }

    const client = new Client({
        image: body.image || faker.image.avatar(),
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phoneNumber: body.phoneNumber,
        email: body.email,
        date: new Date().toISOString()
    });

    client.save()
        .then(client => {
            console.log(client);
            return res.status(201).end();
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.get('/:id', (req, res, err) => {
    const id = req.params.id;

    Client
        .findById(id)
        .then(client => {
            if (client) {
                return res.json(client.toJSON());
            }

            return status(404).end();
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const client = {
        image: req.body.image,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
    };

    Client
        .findByIdAndUpdate(id, client, { new: true })
        .then(updatedClient => {
            console.log(updatedClient);
            return res.status(200).end();
        })
        .catch(err => {
            console.log(err);
            return res.status(400).send({ error: 'Invalid ID' });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Client
        .findByIdAndRemove(id)
        .then(result => res.status(200).end())
        .catch(err => res.status(400).send({ error: 'Invalid ID' }));
});

module.exports = router; 