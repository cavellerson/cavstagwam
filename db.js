const Pool = require("pg").Pool;

const pool = new Pool ({
    user: "cavellerson",
    host: "localhost",
    port: 5432,
    database: "cavstagwam"
})

module.exports = pool;
