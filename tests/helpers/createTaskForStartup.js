const db = require("../../database/db");

async function createMockTaskForStartup(startupId) {
  const task = await db.query(
    "INSERT INTO tasks (name, description, startup_id) VALUES ($1, $2, $3) RETURNING *;",
    ["Test task", "test task description", startupId],
  );

  return task.rows[0];
}

module.exports = createMockTaskForStartup;
