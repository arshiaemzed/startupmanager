const db = require("../database/db");
const cleanDatabase = require("./helpers/cleanDatabase");

afterAll(async () => {
  await cleanDatabase();
  await db.end();
});
