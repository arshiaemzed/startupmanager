const taskService = require("../services/taskService");

async function createNewTask(req, res, next) {
  const { title, description, assigned_to, status } = req.body;

  const startup_id = req.params.id;

  const userId = req.user.id;

  const newTask = await taskService.createNewTask(
    title,
    description,
    startup_id,
    assigned_to,
    userId,
    status,
  );
  return res.status(200).json(newTask);
}

async function getAllTasks(req, res, next) {
  const startupId = req.params.id;
  const userId = req.user.id;

  const tasks = await taskService.getAllTasks(startupId, userId);

  return res.status(200).json(tasks);
}

async function getSingleTask(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;
  const userId = req.user.id;

  const task = await taskService.getSingleTask(startupId, taskId, userId);

  return res.status(200).json(task);
}

async function deleteSingleTask(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;
  const userId = req.user.id;

  const deletedTask = await taskService.deleteSpecificTask(
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

  const updatedTask = await taskService.updateTaskAssignedUser(
    startupId,
    taskId,
    userId,
    assingedId,
  );

  return res.status(200).json(updatedTask);
}

async function updateTask(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;
  const userId = req.user.id;

  const { title, description, status, assigned_to } = req.body;

  const updatedTask = await taskService.updateTask(
    startupId,
    taskId,
    userId,
    title,
    description,
    status,
    assigned_to,
  );

  return res.status(200).json(updatedTask);
}

module.exports = {
  createNewTask,
  getAllTasks,
  getSingleTask,
  deleteSingleTask,
  updateTaskAssignedUser,
  updateTask,
};
