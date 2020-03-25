const express = require('express');
const app = express();

// Body parser
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server connected on PORT ${PORT}`));

// TODO: Implement routes for API in /routes/api
// TODO: Add a logger