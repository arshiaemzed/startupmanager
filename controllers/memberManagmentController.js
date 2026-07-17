const memberManagmentService = require("../services/memberManagmentService");

async function getAllMembers(req, res, next) {
  const startupId = req.params.id;

  const userId = req.user.id;

  const members = await memberManagmentService.getAllMembers(userId, startupId);

  return res.status(200).json(members);
}

async function inviteUserToStartup(req, res, next) {
  const userId = req.user.id;

  const memberId = req.params.id;

  const startupId = req.params.startupid;

  const invitedUser = await memberManagmentService.inviteUserToStartup(
    startupId,
    userId,
    memberId,
  );

  return res.status(200).json(invitedUser);
}

async function searchUsersByNameOrDisplayName(req, res, next) {
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const q = req.query.q ?? "";

  const offset = (page - 1) * limit;

  const users = await memberManagmentService.searchUsersByNameOrDisplayName(
    q,
    limit,
    offset,
  );

  return res.status(200).json(users);
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

  return res.status(200).json(kickedMember);
}

module.exports = {
  getAllMembers,
  getSpecificMember,
  updateMemberRole,
  kickMember,
  getSpecificMember,
  searchUsersByNameOrDisplayName,
  inviteUserToStartup,
};
