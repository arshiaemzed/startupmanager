const express = require("express");
const verifyJWT = require("../middlewares/jwt");
const asyncHandler = require("../middlewares/asyncHandler");
const inviteController = require("../controllers/inviteController");

const router = express.Router();

router.get(
  "/invites",
  verifyJWT,
  asyncHandler(inviteController.getUserInvites),
);

module.exports = router;
