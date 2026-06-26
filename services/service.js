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
    throw new AppError(401, "user not found in db");
  }

  if (user.password != password) {
    throw new AppError(401, "wrong password");
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
  const alreadyJoined = await repository.isUserInStartup(startupId, userId);
  const doesStartupExists = await repository.doesStartupExists(startupId);

  if (!doesStartupExists) {
    throw new AppError(401, "startup does not exist");
  }

  if (alreadyJoined) {
    throw new AppError(401, "you already joined this startup");
  }

  const joinedStartup = await repository.joinStartup(startupId, userId);

  return joinedStartup;
}

async function leaveStartup(startupId, userId) {
  const alreadyJoined = await repository.isUserInStartup(startupId, userId);
  const doesStartupExists = await repository.doesStartupExists(startupId);

  if (!doesStartupExists) {
    throw new AppError(401, "startup doesnt exists");
  }

  if (!alreadyJoined) {
    throw new AppError(401, "You are not joined in this startup");
  }

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
  const isJoinedInStartup = await repository.isUserInStartup(startupId, userId);

  if (!isJoinedInStartup) {
    throw new AppError(401, "You are not joined in the startup");
  }

  const userRole = await repository.getUserRole(startupId, userId);

  if (userRole === "owner") {
    const newTask = await repository.createNewTask(
      title,
      description,
      startupId,
      assigned_to ?? null,
    );
    return newTask;
  }

  throw new AppError(403, "Only owners can create tasks");
}

async function getAllTasks(startupId, userId) {
  const doesStartupExists = await repository.doesStartupExists(startupId);

  if (!doesStartupExists) {
    throw new AppError(401, "Startup doesnt exists");
  }

  const isUserInStartup = await repository.isUserInStartup(startupId, userId);

  if (!isUserInStartup) {
    throw new AppError(401, "You are not joined in the startup");
  }

  const tasks = await repository.getAllTasks(startupId);

  return tasks;
}

async function getSingleTask(startupId, taskId, userId) {
  const doesStartupExists = await repository.doesStartupExists(startupId);

  if (!doesStartupExists) {
    throw new AppError(401, "Startup doesnt exists");
  }

  const isUserInStartup = await repository.isUserInStartup(startupId, userId);

  if (!isUserInStartup) {
    throw new AppError(401, "You are not joined in the startup");
  }

  const task = await repository.getSpecificTask(startupId, taskId);

  return task;
}

async function deleteSpecificTask(startupId, taskId, userId) {
  const doesStartupExists = await repository.doesStartupExists(startupId);

  if (!doesStartupExists) {
    throw new AppError(401, "Startup doesnt exists");
  }

  const doesTaskExists = await repository.doesTaskExists(startupId, taskId);

  if (!doesTaskExists) {
    throw new AppError(401, "Task does not exists");
  }

  const isUserInStartup = await repository.isUserInStartup(startupId, userId);

  if (!isUserInStartup) {
    throw new AppError(401, "You are not joined in the startup");
  }

  const userRole = await repository.getUserRole(startupId, userId);

  if (!(userRole === "owner" || userRole === "admin")) {
    throw new AppError(403, "Only owners and admins can delete tasks");
  }

  const deletedTask = await repository.deleteSpecificTask(startupId, taskId);

  return deletedTask;
}

async function updateTaskAssignedUser(
  startupId,
  taskId,
  userId,
  assignedUserId,
) {
  const doesStartupExists = await repository.doesStartupExists(startupId);

  if (!doesStartupExists) {
    throw new AppError(401, "Startup doesnt exists");
  }

  const doesTaskExists = await repository.doesTaskExists(startupId, taskId);

  if (!doesTaskExists) {
    throw new AppError(401, "Task does not exists");
  }
  const isUserInStartup = await repository.isUserInStartup(startupId, userId);

  if (!isUserInStartup) {
    throw new AppError(401, "You are not joined in the startup");
  }

  const isSecondUserInStartup = await repository.isUserInStartup(
    startupId,
    assignedUserId,
  );

  if (!isSecondUserInStartup) {
    throw new AppError(401, "Selected user is not in startup");
  }

  const userRole = await repository.getUserRole(startupId, userId);

  if (!(userRole === "owner" || userRole === "admin")) {
    throw new AppError(403, "Only owners and admins can assign tasks");
  }

  const updatedTask = await repository.updateTaskAssignedUser(
    startupId,
    taskId,
    assignedUserId,
  );

  return updatedTask;
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
