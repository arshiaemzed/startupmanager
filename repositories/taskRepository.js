const db = require("../database/db");

async function createNewTask(
  title,
  description,
  startupId,
  assignedUserId,
  status,
) {
  const query = await db.query(
    "INSERT INTO tasks (name, description, startup_id, assigned_to, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at",
    [title, description, startupId, assignedUserId ?? null, status ?? "todo"],
  );

  return {
    id: query.rows[0].id,
    name: title,
    description: description,
    startup_id: startupId,
    status: status,
    assigned_to: assignedUserId,
    created_at: query.rows[0].created_at,
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
  const query = await db.query(
    "UPDATE tasks SET assigned_to = $1 WHERE startup_id = $2 AND id = $3",
    [assignedUserId, startupId, taskId],
  );

  return query.rows;
}

// task status column is using ENUM TYPE
// 'todo', 'in_progress', 'done'
async function updateTask(
  startupId,
  taskId,
  title,
  description,
  status,
  assignedTo,
) {
  const query = await db.query(
    `
    UPDATE tasks SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      assigned_to = COALESCE($6, assigned_to)
    WHERE 
      startup_id = $4 AND id = $5
    RETURNING *;
    `,
    [title, description, status, startupId, taskId, assignedTo],
  );

  return query.rows[0];
}

module.exports = {
  createNewTask,
  getAllTasks,
  getSpecificTask,
  doesTaskExists,
  deleteSpecificTask,
  updateTaskAssignedUser,
  updateTask,
};
