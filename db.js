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
    connectionString: "postgres://fvlhjviyjkghew:f2e61c7257ac82506093b39bb2c619281f4d31b682f8f45b46c0c176a8be318b@ec2-35-174-118-71.compute-1.amazonaws.com:5432/d612556j5n030c",
};

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

module.exports = pool;