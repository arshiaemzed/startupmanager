const db = require("../database/db");

async function createNewStartup(name, description, userId) {
  const query = await db.query(
    "INSERT INTO startups (owner, name, description) VALUES($1, $2, $3) RETURNING id",
    [userId, name, description],
  );

  const secondQuery = await db.query(
    "INSERT INTO startup_users (startup_id, user_id, role) VALUES ($1, $2, $3)",
    [query.rows[0].id, userId, "owner"],
  );

  return {
    id: query.rows[0].id,
    owner: userId,
    title: name,
    description: description,
  };
}

async function deleteStartup(startupId) {
  const query = await db.query("DELETE FROM startups WHERE id = $1", [
    startupId,
  ]);

  return { message: "successfully deleted startup" };
}

async function joinStartup(startupId, userId) {
  const query = await db.query(
    "INSERT INTO startup_users (startup_id, user_id) VALUES ($1, $2)",
    [startupId, userId],
  );

  return { message: "joined startup successfully" };
}

async function leaveStartup(startupId, userId) {
  const query = await db.query(
    "DELETE FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return { message: "leaved the startup successfully" };
}

async function isUserInStartup(startupId, userId) {
  const query = await db.query(
    "SELECT FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rowCount > 0;
}

async function doesStartupExists(startupId) {
  const query = await db.query("SELECT FROM startups WHERE id = $1", [
    startupId,
  ]);

  return query.rowCount > 0;
}

async function getUserRole(startupId, userId) {
  const query = await db.query(
    "SELECT * FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rows[0].role;
}

module.exports = {
  createNewStartup,
  deleteStartup,
  joinStartup,
  leaveStartup,
  isUserInStartup,
  doesStartupExists,
  getUserRole,
};
