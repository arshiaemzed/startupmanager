const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/jwt");
const joinStartupMiddleware = require("../middlewares/joinStartupMiddleware");
const createStartupMiddleware = require("../middlewares/createStartupMiddleware");
const startupController = require("../controllers/startupController");
const asyncHandler = require("../middlewares/asyncHandler");

router.post(
  "/startup/join/:id",
  verifyJWT,
  joinStartupMiddleware,
  asyncHandler(startupController.joinStartup),
);

router.post(
  "/startup/leave/:id",
  verifyJWT,
  joinStartupMiddleware,
  asyncHandler(startupController.leaveStartup),
);

router.post(
  "/startup",
  verifyJWT,
  createStartupMiddleware,
  asyncHandler(startupController.createNewStartup),
);

module.exports = router;
