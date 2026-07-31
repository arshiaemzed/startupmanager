const AppError = require("../customErrors");
const {
  requireStartup,
  requireJoining,
  requirePermission,
  requireTask,
  requireUserBeginJoined,
} = require("../guards/serviceGuard");

const taskRepository = require("../repositories/taskRepository");
const errorCodes = require("../utils/errorCodes");

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

  await requireUserBeginJoined(startupId, assigned_to);

  await requirePermission(
    startupId,
    userId,
    ["owner", "admin"],
    "Only owner and admin can create new tasks",
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

  if (!task) {
    throw new AppError(
      404,
      errorCodes.TASK_NOT_FOUND,
      "Unable to find the task.",
    );
  }

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

  if (deletedTask.length < 1) {
    throw new AppError(
      404,
      errorCodes.TASK_NOT_FOUND,
      "Unable to find the task.",
    );
  }
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

  await requireUserBeginJoined(startupId, assigned_to);

  await requirePermission(
    startupId,
    userId,
    ["owner", "admin"],
    "Only users with admin/owner roles can update a task",
  );

  const updatedTask = await taskRepository.updateTask(
    startupId,
    taskId,
    title,
    description,
    status,
    assignedTo,
  );

  if (!updatedTask) {
    throw new AppError(
      404,
      errorCodes.TASK_NOT_FOUND,
      "Unable to find the task.",
    );
  }

  return updatedTask;
}

module.exports = {
  createNewTask,
  getAllTasks,
  getSingleTask,
  deleteSpecificTask,
  updateTask,
};
