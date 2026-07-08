const memberManagmentService = require("../services/memberManagmentService");

async function getAllMembers(req, res, next) {
  const startupId = req.params.id;

  const userId = req.user.id;

  const members = await memberManagmentService.getAllMembers(userId, startupId);

  return res.status(200).json(members);
}

async function getSpecificMember(req, res, next) {
  const userId = req.user.id;

  const memberId = req.params.memberid;

  const startupId = req.params.id;

  const member = await memberManagmentService.getSpecificMember(
    startupId,
    userId,
    memberId,
  );

  return res.status(200).json(member);
}

async function updateMemberRole(req, res, next) {
  const startupId = req.params.id;

  const memberId = req.params.memberid;

  const userId = req.user.id;

  const role = req.body.role;

  const updatedUser = await memberManagmentService.updateUserRole(
    startupId,
    userId,
    memberId,
    role,
  );

  return res.status(200).json(updatedUser);
}

async function kickMember(req, res, next) {
  const userId = req.user.id;
  const startupId = req.params.id;
  const affectedUserId = req.params.memberid;

  const kickedMember = await memberManagmentService.kickMember(
    startupId,
    userId,
    affectedUserId,
  );

  return res.status(200).json();
}

module.exports = {
  getAllMembers,
  getSpecificMember,
  updateMemberRole,
  kickMember,
  getSpecificMember,
};
