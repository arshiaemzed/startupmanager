const express = require("express");
const verifyJWT = require("../middlewares/jwt");
const memeberManagmentMiddleware = require("../middlewares/memberManagmentMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");
const memberManagmentController = require("../controllers/memberManagmentController");
const updateMemberRoleMiddleware = require("../middlewares/updateMemberRoleMiddleware");
const kickMemberMiddleware = require("../middlewares/kickMemberMiddleware");
const getSpecificMemberMiddleware = require("../middlewares/getSpecificMemberMiddleware");
const searchUsersByNameOrDisplayNameMiddleware = require("../middlewares/searchUsersByNameOrDisplayNameMiddleware");

const router = express.Router();

router.post(
  "/users/search",
  verifyJWT,
  searchUsersByNameOrDisplayNameMiddleware,
  asyncHandler(memberManagmentController.searchUsersByNameOrDisplayName),
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
  memberManagmentController.getSpecificMember,
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
