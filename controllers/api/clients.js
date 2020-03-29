const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const faker = require('faker');
const Client = require('../../models/client');

router.get('/', async (req, res, next) => {
    try {
        const clients = await Client.find({});
        return res.json(clients.map(client => client.toJSON()));
    } catch (exception) {
        next(exception);
    }
});

router.post('/', async (req, res, next) => {
    const body = req.body;

    if (!body.userName || !body.password || !body.firstName || !body.lastName || !body.address || !body.phoneNumber || !body.email) {
        return res.status(400).send({ error: 'Missing information' });
    }

    // Hash the user's password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const client = new Client({
        userName: body.userName,
        password: passwordHash,
        image: body.image || faker.image.avatar(),
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        phoneNumber: body.phoneNumber,
        email: body.email,
        date: new Date().toISOString()
    });

    try {
        const clientExists = await Client.exists({
            userName: client.userName,
            firstName: client.firstName,
            lastName: client.lastName,
            address: client.address,
            phoneNumber: client.phoneNumber,
            email: client.email
        });

        if (clientExists) {
            return res.status(400).send({ error: 'Existing client' });
        }

        const result = await client.save();
        return res.status(201).send(result.toJSON());
    } catch (exception) {
        next(exception);
    }
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const client = {
        userName: req.body.userName,
        password: req.body.password,
        image: req.body.image,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
    };

    try {
        const result = await Client.findByIdAndUpdate(id, client, { new: true });
        return res.status(200).send(result.toJSON());
    } catch (exception) {
        next(exception);
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        await Client.findByIdAndRemove(id);
        return res.status(200).end();
    } catch (exception) {
        next(exception);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Client.findById(id);

        if (result) {
            return res.json(result.toJSON());
        }

        return res.status(404).end();
    } catch (exception) {
        next(exception);
    }
});

module.exports = router; 