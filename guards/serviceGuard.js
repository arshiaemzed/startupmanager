async function requireStartup(startupId) {
  const startup = await repository.doesStartupExists(startupId);

  if (!startup) {
    throw new AppError(404, "Startup does not exists");
  }
}

async function requireTask(startupId, taskId) {
  const task = await repository.doesTaskExists(startupId, taskId);

  if (!task) {
    throw new AppError(404, "Task does not exists");
  }
}

async function requirePermission(startupId, userId, permission, errorMessage) {
  const userRole = await repository.getUserRole(startupId, userId);
  if (permission.includes(userRole)) {
    return;
  }

  throw new AppError(403, errorMessage);
}

async function requireJoining(startupId, userId) {
  const isJoined = await repository.isUserInStartup(startupId, userId);

  if (!isJoined) {
    throw new AppError(403, "You are not joined in the startup");
  }
}

async function requireNotBeginJoined(startupId, userId) {
  const alreadyJoined = await repository.isUserInStartup(startupId, userId);

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
