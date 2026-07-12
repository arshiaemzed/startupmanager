const {
  requireStartup,
  requireJoining,
  requirePermission,
  requireTask,
} = require("../guards/serviceGuard");

const taskRepository = require("../repositories/taskRepository");

async function createNewTask(
  title,
  description,
  startupId,
  assigned_to,
  userId,
  status,
) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "Only owner can create new tasks",
  );

  const newTask = await taskRepository.createNewTask(
    title,
    description,
    startupId,
    assigned_to ?? null,
    status ?? null,
  );

  return newTask;
}

async function getAllTasks(startupId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const tasks = await taskRepository.getAllTasks(startupId);

  return tasks;
}

async function getSingleTask(startupId, taskId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const task = await taskRepository.getSpecificTask(startupId, taskId);

  return task;
}

async function deleteSpecificTask(startupId, taskId, userId) {
  await requireStartup(startupId);

  await requireTask(startupId, taskId);

  await requireJoining(startupId, userId);

  await requirePermission(
    startupId,
    userId,
    ["owner", "admin"],
    "Only owner and admin can delete tasks",
  );

  const deletedTask = await taskRepository.deleteSpecificTask(
    startupId,
    taskId,
  );

  return deletedTask;
}

async function updateTaskAssignedUser(
  startupId,
  taskId,
  userId,
  assignedUserId,
) {
  await requireStartup(startupId);

  await requireTask(startupId, taskId);

  await requireJoining(startupId, userId);

  await requireJoining(startupId, assignedUserId);

  await requirePermission(
    startupId,
    userId,
    ["owner", "admin"],
    "Only owner and admin can assign tasks",
  );

  const updatedTask = await taskRepository.updateTaskAssignedUser(
    startupId,
    taskId,
    assignedUserId,
  );

  return updatedTask;
}

async function updateTask(
  startupId,
  taskId,
  userId,
  title,
  description,
  status,
  assignedTo,
) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const updatedTask = await taskRepository.updateTask(
    startupId,
    taskId,
    title,
    description,
    status,
    assignedTo,
  );

  return updatedTask;
}

module.exports = {
  createNewTask,
  getAllTasks,
  getSingleTask,
  deleteSpecificTask,
  updateTaskAssignedUser,
  updateTask,
};
