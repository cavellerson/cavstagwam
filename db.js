const Pool = require("pg").Pool;

const pool = new Pool ({
    user: "cavellerson",
    password: "sexy",
    host: "localhost",
    port: 5432,
    database: "cavstagwam"
})

module.exports = pool;
