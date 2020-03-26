const express = require('express');
const app = express();
const logger = require('./middlewares/logger');
const config = require('./utils/config');
const clientsRouter = require('./routes/api/clients');

// Body parser
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.use('/api/clients', clientsRouter);

app.listen(config.PORT, () => console.log(`Server connected on PORT ${config.PORT}`));

// TODO: Add more API routes 
// TODO: Hook up with database 