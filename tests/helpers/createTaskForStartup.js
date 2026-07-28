const db = require("../../database/db");

async function createMockTaskForStartup(startupId) {
  const task = await db.query(
    "INSERT INTO tasks (name, description, startup_id) VALUES ($1, $2, $3) RETURNING *;",
    ["Test task", "test task description", startupId],
  );

  const taskData = task.rows[0];

  return {
    id: taskData.id,
    name: taskData.name,
    description: taskData.description,
    startup_id: taskData.startup_id,
    assigned_to: taskData.assigned_to,
    status: taskData.status,
    created_at: taskData.created_at,
    updated_at: taskData.updated_at,
  };
}

module.exports = createMockTaskForStartup;
