const config = require('./utils/config');
const app = require('./app');

app.listen(config.PORT, () => console.log(`Server connected on PORT ${config.PORT}`));

// TODO Implement frontend for login