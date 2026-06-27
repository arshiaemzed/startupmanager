const {
  requireStartup,
  requireJoining,
  requirePermission,
} = require("../guards/serviceGuard");

const memberManagmentRepository = require("../repositories/memberManagmentRepository");

async function getAllMembers(userId, startupId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requirePermission(
    startupId,
    userId,
    ["owner", "admin"],
    "Only owner's and admin's can see all members",
  );

  const members = await memberManagmentRepository.getAllMembers(startupId);

  return members;
}

async function updateUserRole(startupId, userId, affectedUserId, role) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requireJoining(startupId, affectedUserId);

  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "Only owner can change user roles",
  );

  const updatedUser = await memberManagmentRepository.updateUserRole(
    startupId,
    affectedUserId,
    role,
  );

  return updatedUser;
}

module.exports = {
  getAllMembers,
  updateUserRole,
};
