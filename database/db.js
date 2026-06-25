const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "startup_manager",
  password: "admin",
  port: 5433,
});

module.exports = pool;
