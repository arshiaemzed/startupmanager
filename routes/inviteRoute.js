const express = require("express");
const verifyJWT = require("../middlewares/jwt");
const asyncHandler = require("../middlewares/asyncHandler");
const inviteController = require("../controllers/inviteController");
const acceptInviteMiddleware = require("../middlewares/acceptInviteMiddleware");
const inviteUserToStartupMiddleware = require("../middlewares/inviteUserToStartupMiddleware");
const declineInviteMiddleware = require("../middlewares/declineInviteMiddleware");

const router = express.Router();

router.get(
  "/invites",
  verifyJWT,
  asyncHandler(inviteController.getUserInvites),
);

router.post(
  "/invites/:id/accept",
  verifyJWT,
  acceptInviteMiddleware,
  asyncHandler(inviteController.acceptInvite),
);

router.post(
  "/invites/:id/decline",
  verifyJWT,
  declineInviteMiddleware,
  asyncHandler(inviteController.declineInvite),
);

router.post(
  "/startup/:startupid/users/:id/invite",
  verifyJWT,
  inviteUserToStartupMiddleware,
  asyncHandler(inviteController.inviteUserToStartup),
);

module.exports = router;
