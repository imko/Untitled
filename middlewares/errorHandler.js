const logger = require('./logger');

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    next();
};

const unknownEndpoint = (req, res) => res.status(404).send({ error: 'Unknown endpoint' });

const errorHandler = (err, req, res, next) => {
    logger.error(err.message);

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).send({ error: 'Invalid ID' });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ err: err.message });
    }

    next(err);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};