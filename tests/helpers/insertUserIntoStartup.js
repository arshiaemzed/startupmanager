const db = require("../../database/db");

async function insertUserIntoStartup(startupId, userId, role) {
  await db.query(
    "INSERT INTO startup_users (startup_id, user_id, role) VALUES ($1, $2, $3)",
    [startupId, userId, role],
  );
}

module.exports = insertUserIntoStartup;
