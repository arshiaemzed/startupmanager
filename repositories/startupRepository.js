const db = require("../database/db");

async function createNewStartup(name, description, userId) {
  const client = await db.connect();
  try {
    await client.query("BEGIN;");

    const startupQuery = await client.query(
      "INSERT INTO startups (owner, name, description) VALUES ($1, $2, $3) RETURNING id",
      [userId, name, description],
    );

    await client.query(
      "INSERT INTO startup_users (startup_id, user_id, role) VALUES ($1, $2, $3)",
      [startupQuery.rows[0].id, userId, "owner"],
    );

    await client.query("COMMIT;");
    return {
      id: startupQuery.rows[0].id,
      owner: userId,
      title: name,
      description: description,
    };
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    client.release();
  }
}

async function getStartup(startupId) {
  const memberResult = await db.query(
    `
    SELECT 
      su.id,
      su.startup_id,
      u.name,
      su.user_id,
      su.role, 
      su.joined_on 
    FROM startup_users su
    INNER JOIN users u
    ON u.id = su.user_id
    WHERE su.startup_id = $1;
    `,
    [startupId],
  );

  const taskResult = await db.query(
    "SELECT * FROM tasks WHERE startup_id = $1;",
    [startupId],
  );

  return {
    startup_id: startupId,
    tasks: taskResult.rows,
    members: memberResult.rows,
  };
}

async function getUserStartups(userId) {
  const query = await db.query(
    `
      SELECT * FROM startups
      JOIN startup_users ON startups.id = startup_users.startup_id AND startup_users.user_id = $1
    `,
    [userId],
  );

  return query.rows;
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
  getUserStartups,
  getStartup,
};
