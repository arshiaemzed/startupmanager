const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");

const pool = require("./database/db");

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received !");

  server.close(async () => {
    console.log("Server will not be accepting new connections!");
    await pool.end();
  });
});
