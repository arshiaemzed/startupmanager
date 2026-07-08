const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/jwt");
const membershipMiddleware = require("../middlewares/membershipMiddleware");
const createStartupMiddleware = require("../middlewares/createStartupMiddleware");
const startupController = require("../controllers/startupController");
const asyncHandler = require("../middlewares/asyncHandler");
const getStartupMiddleware = require("../middlewares/getStartupMiddleware");
const deleteStartupMiddleware = require("../middlewares/deleteStartupMiddleware");

router.get("/startups", verifyJWT, startupController.getUserStartups);

router.post(
  "/startup/join/:id",
  verifyJWT,
  membershipMiddleware,
  asyncHandler(startupController.joinStartup),
);

router.post(
  "/startup/leave/:id",
  verifyJWT,
  membershipMiddleware,
  asyncHandler(startupController.leaveStartup),
);

router.post(
  "/startup",
  verifyJWT,
  createStartupMiddleware,
  asyncHandler(startupController.createNewStartup),
);

router.get(
  "/startup/:id",
  verifyJWT,
  getStartupMiddleware,
  asyncHandler(startupController.getStartup),
);

router.delete(
  "/startup/:id",
  verifyJWT,
  deleteStartupMiddleware,
  startupController.deleteStartup,
);

module.exports = router;
