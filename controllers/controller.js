const service = require("../services/service");
const jwt = require("jsonwebtoken");

const { generateAccessToken } = require("../token_generate");
const { user } = require("pg/lib/defaults");

async function signup(req, res, next) {
  const { email, password } = req.body;

  const user = service.registerUser(email, password);

  return res.status(201).json(user);
}

async function login(req, res, next) {
  const token = await service.login(req.body.email, req.body.password);

  return res.status(200).json(token);
}

async function getUsers(req, res, next) {
  const users = await service.getAllRegisteredUsers();

  return res.status(200).json(users);
}

function refreshJWT(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({ message: "No header" });
  }

  const token = header.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token was found" });
  }

  const refreshToken = jwt.verify(token, "REFRESH_SECRET_1234");
  const newAccessToken = generateAccessToken(refreshToken);
  return res.status(200).json(newAccessToken);
}

function getProfile(req, res, next) {
  const userId = req.user.id;
  const userEmail = req.user.email;

  return res.status(200).json({ userId: userId, userEmail: userEmail });
}

async function logout(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({ message: "request has no header" });
  }

  if (!header.authorization) {
    return res
      .status(400)
      .json({ message: "failed to find the refresh token" });
  }

  const refreshToken = header.authorization.split(" ")[1];

  const data = jwt.verify(refreshToken, "REFRESH_SECRET_1234");

  const logout = await service.logout(data.id, refreshToken);
  return res.status(200).json(logout);
}

async function createNewStartup(req, res, next) {
  const { name, description } = req.body;

  const userId = req.user.id;

  const newStartup = await service.createNewStartup(name, description, userId);

  return res.status(201).json(newStartup);
}

async function joinStartup(req, res, next) {
  const startupId = req.params.id;
  const userId = req.user.id;

  const joinedStartup = await service.joinStartup(startupId, userId);

  return res.status(200).json(joinedStartup);
}

async function leaveStartup(req, res, next) {
  const startupId = req.params.id;
  const userId = req.user.id;

  const leavedStartup = await service.leaveStartup(startupId, userId);

  return res.status(200).json(leavedStartup);
}

async function createNewTask(req, res, next) {
  const { title, description, assigned_to } = req.body;

  const startup_id = req.params.id;

  const userId = req.user.id;

  const newTask = await service.createNewTask(
    title,
    description,
    startup_id,
    assigned_to,
    userId,
  );
  return res.status(200).json(newTask);
}

async function getAllTasks(req, res, next) {
  const startupId = req.params.id;
  const userId = req.user.id;

  const tasks = await service.getAllTasks(startupId, userId);

  return res.status(200).json(tasks);
}

async function getSingleTask(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;
  const userId = req.user.id;

  const task = await service.getSingleTask(startupId, taskId, userId);

  return res.status(200).json(task);
}

async function deleteSingleTask(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;
  const userId = req.user.id;

  const deletedTask = await service.deleteSpecificTask(
    startupId,
    taskId,
    userId,
  );

  return res.status(200).json(deletedTask);
}

async function updateTaskAssignedUser(req, res, next) {
  const taskId = req.params.id;

  const startupId = req.params.startupid;

  const userId = req.user.id;

  const assingedId = req.body.assignedId;

  const updatedTask = await service.updateTaskAssignedUser(
    startupId,
    taskId,
    userId,
    assingedId,
  );

  return res.status(200).json(updatedTask);
}

module.exports = {
  signup,
  login,
  logout,
  getUsers,
  refreshJWT,
  getProfile,
  createNewStartup,
  joinStartup,
  leaveStartup,
  createNewTask,
  getAllTasks,
  getSingleTask,
  deleteSingleTask,
  updateTaskAssignedUser,
};
