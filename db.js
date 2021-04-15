const Pool = require("pg").Pool;
require('dotenv').config()

// const pool = new Pool ({
//     user: process.env.USER,
//     host: process.env.HOST,
//     port: process.env.PORT,
//     database: process.env.DATABASE
// })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();



module.exports = pool;
