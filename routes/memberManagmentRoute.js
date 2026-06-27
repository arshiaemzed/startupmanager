const express = require("express");
const verifyJWT = require("../middlewares/jwt");
const memeberManagmentMiddleware = require("../middlewares/memberManagmentMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");
const memberManagmentController = require("../controllers/memberManagmentController");
const updateMemberRoleMiddleware = require("../middlewares/updateMemberRoleMiddleware");
const kickMemberMiddleware = require("../middlewares/kickMemberMiddleware");

const router = express.Router();

router.get(
  "/startup/:id/members",
  verifyJWT,
  memeberManagmentMiddleware,
  asyncHandler(memberManagmentController.getAllMembers),
);

router.patch(
  "/startup/:id/members/:memberid/role",
  verifyJWT,
  updateMemberRoleMiddleware,
  memberManagmentController.updateMemberRole,
);

router.delete(
  "/startup/:id/members/:memberid/kick",
  verifyJWT,
  kickMemberMiddleware,
  memberManagmentController.kickMember,
);

module.exports = router;
