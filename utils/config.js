require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI;
const SECRET = 'foobar';

module.exports = {
    PORT,
    MONGO_URI,
    SECRET
};