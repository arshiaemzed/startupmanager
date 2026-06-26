const express = require("express");
const router = express.Router();
const createNewTaskMiddleware = require("../middlewares/createNewTaskMiddleware");
const verifyJWT = require("../middlewares/jwt");
const taskController = require("../controllers/taskController");
const asyncHandler = require("../middlewares/asyncHandler");

router.post(
  "/startup/:id/tasks",
  verifyJWT,
  createNewTaskMiddleware,
  asyncHandler(taskController.createNewTask),
);

router.get(
  "/startup/:id/tasks",
  verifyJWT,
  asyncHandler(taskController.getAllTasks),
);

router.get(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  asyncHandler(taskController.getSingleTask),
);

router.delete(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  asyncHandler(taskController.deleteSingleTask),
);

router.patch(
  "/startup/:startupid/tasks/:id/assign",
  verifyJWT,
  asyncHandler(taskController.updateTaskAssignedUser),
);

module.exports = router;
