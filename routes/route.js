const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/jwt");
const controller = require("../controllers/controller");
const createStartupMiddleware = require("../middlewares/createStartupMiddleware");
const joinStartupMiddleware = require("../middlewares/joinStartupMiddleware");
const createNewTaskMiddleware = require("../middlewares/createNewTaskMiddleware");
const signupMiddleware = require("../middlewares/signupMiddleware");

router.post("/auth/signup", signupMiddleware, asyncHandler(controller.signup));

router.post("/auth/login", asyncHandler(controller.login));

router.post("/auth/refresh", asyncHandler(controller.refreshJWT));

router.get("/profile", verifyJWT, asyncHandler(controller.getProfile));

router.get("/users", verifyJWT, asyncHandler(controller.getUsers));

router.post("/auth/logout", asyncHandler(controller.logout));

router.post(
  "/startup/join/:id",
  verifyJWT,
  joinStartupMiddleware,
  asyncHandler(controller.joinStartup),
);

router.post(
  "/startup/leave/:id",
  verifyJWT,
  joinStartupMiddleware,
  asyncHandler(controller.leaveStartup),
);

router.post(
  "/startup",
  verifyJWT,
  createStartupMiddleware,
  asyncHandler(controller.createNewStartup),
);

router.post(
  "/startup/:id/tasks",
  verifyJWT,
  createNewTaskMiddleware,
  asyncHandler(controller.createNewTask),
);

router.get(
  "/startup/:id/tasks",
  verifyJWT,
  asyncHandler(controller.getAllTasks),
);

router.get(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  asyncHandler(controller.getSingleTask),
);

router.delete(
  "/startup/:startupid/tasks/:id",
  verifyJWT,
  asyncHandler(controller.deleteSingleTask),
);

router.patch(
  "/startup/:startupid/tasks/:id/assign",
  verifyJWT,
  asyncHandler(controller.updateTaskAssignedUser),
);

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
}

module.exports = router;
