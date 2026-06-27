const express = require("express");
const router = express.Router();
const createNewTaskMiddleware = require("../middlewares/createNewTaskMiddleware");
const getAllTasksMiddleware = require("../middlewares/getAllTasksMiddleware");
const updateTaskMiddleware = require("../middlewares/updateTaskMiddleware");
const verifyJWT = require("../middlewares/jwt");
const taskController = require("../controllers/taskController");
const asyncHandler = require("../middlewares/asyncHandler");
const getSingleTaskMiddleware = require("../middlewares/getSingleTaskMiddleware");
const deleteSingleTaskMiddleware = require("../middlewares/deleteSingleTaskMiddleware");
const updateTaskAssignedUserMiddleware = require("../middlewares/updateTaskAssignedUserMiddleware");

router.post(
  "/startup/:id/tasks",
  verifyJWT,
  createNewTaskMiddleware,
  asyncHandler(taskController.createNewTask),
);

router.get(
  "/startup/:id/tasks",
  verifyJWT,
  getAllTasksMiddleware,
  asyncHandler(taskController.getAllTasks),
);

router.get(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  getSingleTaskMiddleware,
  asyncHandler(taskController.getSingleTask),
);

router.delete(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  deleteSingleTaskMiddleware,
  asyncHandler(taskController.deleteSingleTask),
);

router.patch(
  "/startup/:startupid/tasks/:id/assign",
  verifyJWT,
  updateTaskAssignedUserMiddleware,
  asyncHandler(taskController.updateTaskAssignedUser),
);

router.patch(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  updateTaskMiddleware,
  asyncHandler(taskController.updateTask),
);

module.exports = router;
