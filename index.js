const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const config = require('./utils/config');
const clientsRouter = require('./routes/api/clients');

// Body parser
app.use(express.json());
app.use(errorHandler.requestLogger);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.use('/api/clients', clientsRouter);

app.use(errorHandler.unknownEndpoint);
app.use(errorHandler.errorHandler);

app.listen(config.PORT, () => console.log(`Server connected on PORT ${config.PORT}`));

// TODO: Add testing
// TODO: Add more API routes 