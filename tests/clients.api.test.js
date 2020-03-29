const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./clients.api.test.helper');
const Client = require('../models/client');

const api = supertest(app);

beforeEach(async () => {
    await Client.deleteMany({});

    // const clientObjects = [];
    for (const client of helper.clients) {
        // Hash the user's password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(client.password, saltRounds);

        const c = new Client(client);
        c.password = passwordHash;
        // clientObjects.push(c);
        await c.save();
    }

    // const clientObjects = helper.clients.map(client => new Client(client));
    // const promiseArray = clientObjects.map(client => client.save());
    // await Promise.all(promiseArray);
});

describe('Test clients returned by HTTP GET', () => {
    test('All clients in the database', async () => {
        const result = await api
            .get('/api/clients')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(result.body.length).toBe(helper.clients.length);
    });

    test('Specific client in the database', async () => {
        const result = await api.get('/api/clients');

        expect(result.body[0].firstName).toEqual(helper.clients[0].firstName);
        expect(result.body[0].lastName).toEqual(helper.clients[0].lastName);
        expect(result.body[0].email).toEqual(helper.clients[0].email);
        expect(result.body[0].address).toEqual(helper.clients[0].address);
    });

    test('Single client with ID in the database', async () => {
        const clients = await api
            .get('/api/clients')
            .expect(200);

        await api
            .get(`/api/clients/${clients.body[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('All clients do not show password', async () => {
        const clients = await api
            .get('/api/clients')
            .expect(200);

        clients.body.forEach(client => expect(client.password).toBeUndefined());
    });
});

describe('Test clients added by HTTP POST', () => {
    test('Client with valid payload', async () => {
        const client = helper.generateRandomClient();
        await api
            .post('/api/clients')
            .send(client)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const result = await api
            .get('/api/clients')
            .expect(200);

        expect(result.body.length).toBe(helper.clients.length + 1);
        expect(result.body[result.body.length - 1].firstName).toEqual(client.firstName);
        expect(result.body[result.body.length - 1].lastName).toEqual(client.lastName);
        expect(result.body[result.body.length - 1].email).toEqual(client.email);
        expect(result.body[result.body.length - 1].address).toEqual(client.address);
    });

    test('Existing client in the database', async () => {
        const result = await api
            .post('/api/clients')
            .send(helper.clients[0])
            .expect(400);

        const clients = await api
            .get('/api/clients')
            .expect(200);

        expect(result.body).toEqual({ error: 'Existing client' });
        expect(clients.body.length).toBe(helper.clients.length);
    });

    test('Client with missing info in payload', async () => {
        const client = helper.generateRandomClient();
        client.firstName = null;
        client.lastName = null;

        const result = await api
            .post('/api/clients')
            .send(client)
            .expect(400);

        const clients = await api
            .get('/api/clients')
            .expect(200);

        expect(result.body).toEqual({ error: 'Missing information' });
        expect(clients.body.length).toBe(helper.clients.length);
    });
});

describe('Test clients updated by HTTP PUT', () => {
    test('Client with valid payload', async () => {
        const clients = await api
            .get('/api/clients')
            .expect(200);

        const client = helper.generateRandomClient();
        client.id = clients.body[0].id;

        const result = await api
            .put(`/api/clients/${client.id}`)
            .send(client)
            .expect(200);

        expect(result.body.firstName).toEqual(client.firstName);
        expect(result.body.lastName).toEqual(client.lastName);
        expect(result.body.email).toEqual(client.email);
        expect(result.body.address).toEqual(client.address);
    });

    test('Client with existing info', async () => {
        const clients = await api
            .get('/api/clients')
            .expect(200);

        const client = clients.body[0];

        const result = await api
            .put(`/api/clients/${client.id}`)
            .send(client)
            .expect(200);

        expect(result.body.firstName).toEqual(client.firstName);
        expect(result.body.lastName).toEqual(client.lastName);
        expect(result.body.email).toEqual(client.email);
        expect(result.body.address).toEqual(client.address);
    });

    test('Non-existing client in the database', async () => {
        const client = helper.clients[0];
        client.id = 'INVALID_ID';

        const result = await api
            .put(`/api/clients/${client.id}`)
            .send(client)
            .expect(400);

        expect(result.body).toEqual({ error: 'Invalid ID' });
    });
});

describe('Test clients deleted by HTTP DELETE', () => {
    test('Client with valid ID', async () => {
        let clients = await api
            .get('/api/clients')
            .expect(200);

        await api
            .delete(`/api/clients/${clients.body[0].id}`)
            .expect(200);

        await api
            .get(`/api/clients/${clients.body[0].id}`)
            .expect(404);

        clients = await api
            .get('/api/clients')
            .expect(200);

        expect(clients.body.length).toBe(helper.clients.length - 1);
    });

    test('Non-existing client in the database', async () => {
        const client = helper.clients[0];
        client.id = 'INVALID_ID';

        const result = await api
            .delete(`/api/clients/${client.id}`)
            .send(client)
            .expect(400);

        expect(result.body).toEqual({ error: 'Invalid ID' });
    });
});

afterAll(() => mongoose.connection.close());