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
        const client = await Client.findById(body.client);

        if (client) {
            const appointment = new Appointment({
                client: client._id,
                createdAt: new Date().toISOString(),
                appointmentTime: body.appointmentTime,
                duration: body.duration,
                location: body.location
            });

            const appointmentExists = await Appointment.exists({
                client: appointment.client,
                appointmentTime: appointment.appointmentTime,
                duration: appointment.duration,
                location: appointment.location
            });

            if (appointmentExists) {
                return res.status(400).send({ error: 'Existing appointment' });
            }

            const result = await appointment.save();
            client.appointments = client.appointments.concat(result._id);
            await client.save();

            return res.status(201).send(result.toJSON());
        }

        return res.status(400).send({ error: 'Non-existing client' });
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
        const result = await Appointment.findByIdAndUpdate(id, appointment, { new: true });

        return res.status(200).send(result.toJSON());
    } catch (exception) {
        next(exception);
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        const result = await Appointment.findByIdAndRemove(id);

        if (result) {
            const client = await Client.findById(result.client);
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
        const appointment = await Appointment.findById(id);

        if (appointment) {
            return res.json(appointment.toJSON());
        }

        return res.status(404).end();
    } catch (exception) {
        next(exception);
    }
});

module.exports = router;