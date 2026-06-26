const startupRepository = require("../repositories/startupRepository");
const taskRepository = require("../repositories/taskRepository");
const authRepository = require("../repositories/authRepository");
const AppError = require("../customErrors");

async function requireStartup(startupId) {
  const startup = await startupRepository.doesStartupExists(startupId);

  if (!startup) {
    throw new AppError(404, "Startup does not exists");
  }
}

async function requireTask(startupId, taskId) {
  const task = await taskRepository.doesTaskExists(startupId, taskId);

  if (!task) {
    throw new AppError(404, "Task does not exists");
  }
}

async function requirePermission(startupId, userId, permission, errorMessage) {
  const userRole = await startupRepository.getUserRole(startupId, userId);

  if (permission.includes(userRole)) {
    return;
  }

  throw new AppError(403, errorMessage);
}

async function requireJoining(startupId, userId) {
  const isJoined = await startupRepository.isUserInStartup(startupId, userId);

  if (!isJoined) {
    throw new AppError(403, "You are not joined in the startup");
  }
}

async function requireNotBeginJoined(startupId, userId) {
  const alreadyJoined = await startupRepository.isUserInStartup(
    startupId,
    userId,
  );

  if (alreadyJoined) {
    throw new AppError(403, "You already joined the startup");
  }
}

module.exports = {
  requireStartup,
  requireTask,
  requirePermission,
  requireJoining,
  requireNotBeginJoined,
};
