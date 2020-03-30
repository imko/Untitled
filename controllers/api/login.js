const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const config = require('../../utils/config');
const Client = require('../../models/client');

router.post('/', async (req, res) => {
    const body = req.body;

    const client = await Client.findOne({ userName: body.userName });
    const correctPassword = client === null ? false : await bcrypt.compare(body.password, client.password);

    if (!client || !correctPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const clientForToken = {
        username: client.userName,
        id: client._id
    };

    const token = jwt.sign(clientForToken, config.SECRET);

    return res.status(200).send({ token, userName: client.userName, firstName: client.firstName, lastName: client.lastName });
});

module.exports = router;