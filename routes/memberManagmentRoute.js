const express = require("express");
const verifyJWT = require("../middlewares/jwt");
const memeberManagmentMiddleware = require("../middlewares/memberManagmentMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");
const memberManagmentController = require("../controllers/memberManagmentController");
const updateMemberRoleMiddleware = require("../middlewares/updateMemberRoleMiddleware");
const kickMemberMiddleware = require("../middlewares/kickMemberMiddleware");
const getSpecificMemberMiddleware = require("../middlewares/getSpecificMemberMiddleware");
const inviteUserToStartupMiddleware = require("../middlewares/inviteUserToStartupMiddleware");

const router = express.Router();

router.get(
  "/users",
  verifyJWT,
  asyncHandler(memberManagmentController.searchUsersByNameOrDisplayName),
);

router.post(
  "/startup/:startupid/users/:id/invite",
  verifyJWT,
  inviteUserToStartupMiddleware,
  asyncHandler(memberManagmentController.inviteUserToStartup),
);

router.get(
  "/startup/:id/members",
  verifyJWT,
  memeberManagmentMiddleware,
  asyncHandler(memberManagmentController.getAllMembers),
);

router.get(
  "/startup/:id/members/:memberid",
  verifyJWT,
  getSpecificMemberMiddleware,
  asyncHandler(memberManagmentController.getSpecificMember),
);

router.patch(
  "/startup/:id/members/:memberid/role",
  verifyJWT,
  updateMemberRoleMiddleware,
  asyncHandler(memberManagmentController.updateMemberRole),
);

router.delete(
  "/startup/:id/members/:memberid/kick",
  verifyJWT,
  kickMemberMiddleware,
  asyncHandler(memberManagmentController.kickMember),
);

module.exports = router;
