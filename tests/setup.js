const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env.test"),
});

console.log(process.env.DATABASE_NAME);
