const db = require("../database/db");

async function createNewUser(email, password) {
  const query = await db.query(
    `
        INSERT INTO users(email, password) VALUES ($1, $2);    
    `,
    [email, password],
  );

  return { email: email, password: password };
}

async function isRefreshTokenValid(userId, token) {
  const found = await db.query(
    "SELECT * FROM user_refresh_tokens WHERE user_id = $1 AND token = $2",
    [userId, token],
  );

  return found.rowCount > 0;
}

async function deleteRefreshToken(userId, token) {
  const found = await db.query(
    "DELETE FROM user_refresh_tokens WHERE user_id = $1 AND token = $2",
    [userId, token],
  );

  return found.rowCount > 0;
}

async function findUser(email) {
  const query = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  return query.rows[0];
}

async function selectAllUsers() {
  const text = "SELECT email AS user_email FROM users";

  const query = await db.query(text);

  return query.rows;
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

async function isUserInStartup(startupId, userId) {
  const query = await db.query(
    "SELECT FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rowCount > 0;
}

async function storeRefreshToken(userId, token) {
  const query = await db.query(
    "INSERT INTO user_refresh_tokens (user_id, token, expires_at) VALUES($1, $2, NOW() + INTERVAL '7 days')",
    [userId, token],
  );
  return { message: "User token stored successfully" };
}

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

async function createNewTask(title, description, startupId, assignedUserId) {
  const query = await db.query(
    "INSERT INTO tasks (name, description, startup_id, assigned_to) VALUES ($1, $2, $3, $4) RETURNING id",
    [title, description, startupId, assignedUserId ?? null],
  );

  return {
    id: query.rows[0].id,
    title: title,
    startup_id: startupId,
    assigned_to: assignedUserId,
  };
}

async function getAllTasks(startupId) {
  const query = await db.query("SELECT * FROM tasks WHERE startup_id = $1", [
    startupId,
  ]);

  return query.rows;
}

async function getSpecificTask(startupId, taskId) {
  const query = await db.query(
    "SELECT * FROM tasks WHERE startup_id = $1 AND id = $2",
    [startupId, taskId],
  );

  return query.rows;
}

async function doesTaskExists(startupId, taskId) {
  const query = await db.query(
    "SELECT * FROM tasks WHERE startup_id = $1 AND id = $2",
    [startupId, taskId],
  );

  return query.rowCount > 0;
}

async function deleteSpecificTask(startupId, taskId) {
  const query = await db.query(
    "DELETE FROM tasks WHERE startup_id = $1 AND id = $2 RETURNING id",
    [startupId, taskId],
  );

  return query.rows;
}

async function updateTaskAssignedUser(startupId, taskId, assignedUserId) {
  console.log(startupId);
  console.log(taskId);
  console.log(assignedUserId);
  const query = await db.query(
    "UPDATE tasks SET assigned_to = $1 WHERE startup_id = $2 AND id = $3",
    [assignedUserId, startupId, taskId],
  );

  return query.rows;
}

module.exports = {
  createNewUser,
  selectAllUsers,
  findUser,
  storeRefreshToken,
  isRefreshTokenValid,
  deleteRefreshToken,
  createNewStartup,
  joinStartup,
  doesStartupExists,
  isUserInStartup,
  leaveStartup,
  getUserRole,
  deleteStartup,
  doesTaskExists,
  createNewTask,
  getAllTasks,
  getSpecificTask,
  deleteSpecificTask,
  updateTaskAssignedUser,
};
