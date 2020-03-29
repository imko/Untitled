const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const Appointment = require('../../models/appointment');

router.get('/', async (req, res, next) => {
    try {
        const appointments = await Appointment.find({});
        return res.json(appointments.map(appointment => appointment.toJSON()));
    } catch (exception) {
        next(exception);
    }
});

router.post('/', async (req, res, next) => {
    const body = req.body;

    try {
        const client = await Client.findById(body.clientId);

        if (client) {
            const appointment = new Appointment({
                client: client._id,
                createdAt: new Date().toISOString(),
                appointmentTime: body.appointmentTime,
                duration: body.duration,
                location: body.location
            });

            const result = await appointment.save();
            client.appointments = client.appointments.concat(result._id);
            await client.save();

            return res.status(201).send(result.toJSON());
        }
    } catch (exception) {
        next(exception);
    }
});

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const appointment = {
        appointmentTime: req.body.appointmentTime,
        duration: req.body.duration
    };

    try {
        const result = Appointment.findByIdAndUpdate(id, appointment, { new: true });
        return res.status(200).send(result.toJSON());
    } catch (exception) {
        next(exception);
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const client = req.body.clientId;

    try {
        const result = await Appointment.findByIdAndRemove(id);

        if (result) {
            const client = await Client.findById(client._id);
            client.appointments = client.appointments.filter(appointment => appointment._id !== result._id);

            return res.status(200).end();
        }

        return res.status(400).send({ error: 'Invalid appointment ID' });
    } catch (exception) {
        next(exception);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const appointment = Appointment.findById(id);

        if (appointment) {
            return res.json(appointment.toJSON());
        }

        return res.status(404).end();
    } catch (exception) {
        next(exception);
    }
});

module.exports = router;