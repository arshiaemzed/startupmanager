const db = require("../database/db");

async function checkHealth() {
  const query = await db.query("SELECT 1 ");

  return query.rowCount > 0;
}

module.exports = {
  checkHealth,
};
