const AppError = require("../customErrors");
const {
  requireStartup,
  requireJoining,
  requirePermission,
} = require("../guards/serviceGuard");

const memberManagmentRepository = require("../repositories/memberManagmentRepository");
const errorCodes = require("../utils/errorCodes");

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

  if (userId === affectedUserId) {
    throw new AppError(
      400,
      errorCodes.CANNOT_KICK_YOURSELF,
      "You cannot kick yourself",
    );
  }

  const updatedUser = await memberManagmentRepository.updateUserRole(
    startupId,
    affectedUserId,
    role,
  );

  return updatedUser;
}

async function kickMember(startupId, userId, affectedUserId) {
  await requireStartup(startupId, userId);

  await requireJoining(startupId, userId);

  await requireJoining(startupId, affectedUserId);

  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "Only owner's can kick members out of startup",
  );

  const kickedMember = await memberManagmentRepository.kickMember(
    startupId,
    affectedUserId,
  );

  return kickedMember;
}

module.exports = {
  getAllMembers,
  updateUserRole,
  kickMember,
};
