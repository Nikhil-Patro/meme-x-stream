const Pool = require('pg').Pool;
require("dotenv").config();
// config for development
const devConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
};

// config for production

const proConfig = {
    connectionString: process.env.DATABASE_URL,
};

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

module.exports = pool;