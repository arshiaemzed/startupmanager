const repository = require("../repositories/repository");
const {
  generateAccessToken,
  genereateRefreshToken,
} = require("../token_generate");

const AppError = require("../customErrors");

async function registerUser(email, password) {
  return repository.createNewUser(email, password);
}

async function getAllRegisteredUsers() {
  return repository.selectAllUsers();
}

/**
 * verifies user email and password and generates JWT tokens for authentication
 * token types => access token and refresh token
 * access token is used for authentication
 * refresh token is used for regenerating access tokens
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<accessToken: string, refreshToken: string>}
 */
async function login(email, password) {
  const user = await repository.findUser(email);

  if (!user) {
    throw new AppError(401, "Invalid credentials.");
  }

  if (user.password !== password) {
    throw new AppError(401, "Invalid credentials.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = genereateRefreshToken(user);

  await repository.storeRefreshToken(user.id, refreshToken);

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

/**
 * Logs out a user by invalidating their refresh token
 *
 * This prevents further access to generating access tokens with the same refresh token
 *
 * @param {string} userId
 * @param {string} refreshToken
 * @returns {Promise<message: string>}
 */
async function logout(userId, refreshToken) {
  const verifyRefreshToken = await repository.isRefreshTokenValid(
    userId,
    refreshToken,
  );

  if (!verifyRefreshToken) {
    throw new AppError(401, "Refresh token is not valid");
  }

  const deletedRefreshToken = await repository.deleteRefreshToken(
    userId,
    refreshToken,
  );

  if (!deletedRefreshToken) {
    throw new AppError(401, "Failed to delete refresh token");
  }

  return { message: "Successfully logged out and killed the refresh token" };
}

async function createNewStartup(name, description, userId) {
  const startup = await repository.createNewStartup(name, description, userId);

  return startup;
}

async function joinStartup(startupId, userId) {
  await requireStartup(startupId);

  await requireNotBeginJoined(startupId, userId);

  const joinedStartup = await repository.joinStartup(startupId, userId);

  return joinedStartup;
}

async function leaveStartup(startupId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const userRole = await repository.getUserRole(startupId, userId);

  if (userRole === "owner") {
    return await repository.deleteStartup(startupId);
  }

  const leavedStartup = await repository.leaveStartup(startupId, userId);

  return leavedStartup;
}

async function createNewTask(
  title,
  description,
  startupId,
  assigned_to,
  userId,
) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "Only owner can create new tasks",
  );

  const newTask = await repository.createNewTask(
    title,
    description,
    startupId,
    assigned_to ?? null,
  );

  return newTask;
}

async function getAllTasks(startupId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const tasks = await repository.getAllTasks(startupId);

  return tasks;
}

async function getSingleTask(startupId, taskId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const task = await repository.getSpecificTask(startupId, taskId);

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

  const deletedTask = await repository.deleteSpecificTask(startupId, taskId);

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

  const updatedTask = await repository.updateTaskAssignedUser(
    startupId,
    taskId,
    assignedUserId,
  );

  return updatedTask;
}

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
  registerUser,
  getAllRegisteredUsers,
  login,
  logout,
  createNewStartup,
  joinStartup,
  leaveStartup,
  createNewTask,
  getAllTasks,
  getSingleTask,
  deleteSpecificTask,
  updateTaskAssignedUser,
};
