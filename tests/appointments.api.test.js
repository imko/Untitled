const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./appointments.api.test.helper');
const Appointment = require('../models/appointment');

const api = supertest(app);

beforeEach(async () => {
    await Appointment.deleteMany({});

    for (const appointment of helper.appointments) {
        const a = new Appointment(appointment);
        await a.save();
    }
});

describe('Test appointments returned by HTTP GET', () => {
    test('All appointments in the database', async () => {
        const result = await api
            .get('/api/appointments')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(result.body.length).toBe(helper.appointments.length);
    });

    test('Specific appointment in the database', async () => {
        const result = await api.get('/api/appointments');
        expect(result.body[0].client).toEqual(String(helper.appointments[0].client));
        expect(result.body[0].createdAt).toEqual(helper.appointments[0].createdAt);
        expect(result.body[0].appointmentTime).toEqual(helper.appointments[0].appointmentTime);
        expect(result.body[0].duration).toEqual(helper.appointments[0].duration);
        expect(result.body[0].location).toEqual(helper.appointments[0].location);
    });

    test('Single appointment with ID in the database', async () => {
        const appointments = await api
            .get('/api/appointments')
            .expect(200);

        await api
            .get(`/api/appointments/${appointments.body[0].id}`)
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

describe('Test appointments added by HTTP POST', () => {
    test('Appointment with valid payload', async () => {
        const appointment = await helper.generateRandomAppointment();
        await api
            .post('/api/appointments')
            .send(appointment)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const result = await api
            .get('/api/appointments')
            .expect(200);

        // Only check dates due to time difference during the test run
        expect(result.body.length).toBe(helper.appointments.length + 1);
        expect(result.body[result.body.length - 1].createdAt.substring(0, 10)).toEqual(appointment.createdAt.substring(0, 10));
        expect(result.body[result.body.length - 1].appointmentTime.substring(0, 10)).toEqual(appointment.appointmentTime.substring(0, 10));
        expect(result.body[result.body.length - 1].duration).toEqual(appointment.duration);
        expect(result.body[result.body.length - 1].location).toEqual(appointment.location);
    });

    test('Existing appointment in the database', async () => {
        const result = await api
            .post('/api/appointments')
            .send(helper.appointments[0])
            .expect(400);

        const appointments = await api
            .get('/api/appointments')
            .expect(200);

        expect(result.body).toEqual({ error: 'Existing appointment' });
        expect(appointments.body.length).toBe(helper.appointments.length);
    });
});

describe('Test appointments updated by HTTP PUT', () => {
    test('Appointment with valid payload', async () => {
        const appointments = await api
            .get('/api/appointments')
            .expect(200);

        const appointment = await helper.generateRandomAppointment();
        appointment.id = appointments.body[0].id;
        appointment.location = appointments.body[0].location;

        const result = await api
            .put(`/api/appointments/${appointment.id}`)
            .send(appointment)
            .expect(200);

        // Only check dates due to time difference during the test run
        expect(result.body.createdAt.substring(0, 10)).toEqual(appointment.createdAt.substring(0, 10));
        expect(result.body.appointmentTime.substring(0, 10)).toEqual(appointment.appointmentTime.substring(0, 10));
        expect(result.body.duration).toEqual(appointment.duration);
        expect(result.body.location).toEqual(appointment.location);
    });

    test('Appointment with existing info', async () => {
        const appointments = await api
            .get('/api/appointments')
            .expect(200);

        const appointment = appointments.body[0];

        const result = await api
            .put(`/api/appointments/${appointment.id}`)
            .send(appointment)
            .expect(200);

        // Only check dates due to time difference during the test run
        expect(result.body.createdAt.substring(0, 10)).toEqual(appointment.createdAt.substring(0, 10));
        expect(result.body.appointmentTime.substring(0, 10)).toEqual(appointment.appointmentTime.substring(0, 10));
        expect(result.body.duration).toEqual(appointment.duration);
        expect(result.body.location).toEqual(appointment.location);
    });

    test('Non-existing appointment in the database', async () => {
        const appointment = helper.appointments[0];
        appointment.id = 'INVALID_ID';

        const result = await api
            .put(`/api/appointments/${appointment.id}`)
            .send(appointment)
            .expect(400);

        expect(result.body).toEqual({ error: 'Invalid ID' });
    });
});

describe('Test appointments deleted by HTTP DELETE', () => {
    test('Appointment with valid ID', async () => {
        let appointments = await api
            .get('/api/appointments')
            .expect(200);

        await api
            .delete(`/api/appointments/${appointments.body[0].id}`)
            .expect(200);

        await api
            .get(`/api/appointments/${appointments.body[0].id}`)
            .expect(404);

        appointments = await api
            .get('/api/appointments')
            .expect(200);

        expect(appointments.body.length).toBe(helper.appointments.length - 1);
    });

    test('Non-existing appointment in the database', async () => {
        const appointment = helper.appointments[0];
        appointment.id = 'INVALID_ID';

        const result = await api
            .delete(`/api/appointments/${appointment.id}`)
            .send(appointment)
            .expect(400);

        expect(result.body).toEqual({ error: 'Invalid ID' });
    });
});


afterAll(() => mongoose.connection.close());