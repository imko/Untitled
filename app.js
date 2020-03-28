const express = require('express');
const app = express();
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const config = require('./utils/config');
const clientsRouter = require('./controllers/api/clients');

(async () => {
    try {
        mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        logger.info('Connected to MongoDB');
    } catch (exception) {
        logger.info('Failed to connect to MongoDB', exception);
    }
})();

// Body parser
app.use(express.json());
app.use(errorHandler.requestLogger);

app.get('/', (req, res) => res.send('<h1>Hello world</h1>'));

app.use('/api/clients', clientsRouter);

app.use(errorHandler.unknownEndpoint);
app.use(errorHandler.errorHandler);

module.exports = app;