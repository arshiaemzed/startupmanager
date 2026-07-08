const db = require("../database/db");

async function getAllMembers(startupId) {
  const query = await db.query(
    "SELECT * FROM startup_users WHERE startup_id = $1",
    [startupId],
  );

  return query.rows;
}

async function getSpecificMember(startupId, userId) {
  const query = await db.query(
    "SELECT * FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rows[0];
}

async function updateUserRole(startupId, userId, role) {
  const query = await db.query(
    "UPDATE startup_users SET role = $1 WHERE startup_id = $2 AND user_id = $3",
    [role, startupId, userId],
  );

  return query.rows;
}

async function kickMember(startupId, userId) {
  const query = await db.query(
    "DELETE FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rows;
}

module.exports = {
  getAllMembers,
  getSpecificMember,
  updateUserRole,
  kickMember,
};
