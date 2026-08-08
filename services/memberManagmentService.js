const AppError = require("../customErrors");
const {
  requireStartup,
  requireJoining,
  requirePermission,
  requireUserBeginJoined,
} = require("../guards/serviceGuard");
const memeberManagmentMiddleware = require("../middlewares/memberManagmentMiddleware");

const memberManagmentRepository = require("../repositories/memberManagmentRepository");
const errorCodes = require("../utils/errorCodes");

async function getAllMembers(userId, startupId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const members = await memberManagmentRepository.getAllMembers(startupId);

  return members;
}

async function searchUsersByNameOrDisplayName(value, limit, offset) {
  const users = await memberManagmentRepository.searchUsersByNameOrDisplayName(
    value,
    limit,
    offset,
  );

  return users;
}

async function getSpecificMember(startupId, userId, targetId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requireUserBeginJoined(startupId, targetId);

  const member = await memberManagmentRepository.getSpecificMember(
    startupId,
    targetId,
  );

  return member;
}

async function updateUserRole(startupId, userId, affectedUserId, role) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requireJoining(startupId, affectedUserId);

  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "Only owner's can change user roles",
  );

  if (userId === affectedUserId) {
    throw new AppError(
      400,
      errorCodes.CANNOT_KICK_YOURSELF,
      "You change your own role",
    );
  }

  const updatedUser = await memberManagmentRepository.updateUserRole(
    startupId,
    affectedUserId,
    role,
  );

  return updatedUser;
}

async function transferOwnership(startupId, userId, targetId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "You need to be an owner in order to be able to transfer ownership.",
  );

  await requireUserBeginJoined(startupId, targetId);

  const newOwner = await memberManagmentRepository.transferOwnership(
    startupId,
    userId,
    targetId,
  );

  return newOwner;
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

  if (userId == affectedUserId) {
    throw new AppError(
      403,
      errorCodes.NO_PERMISSION,
      "You cannot kick yourself.",
    );
  }

  const kickedMember = await memberManagmentRepository.kickMember(
    startupId,
    affectedUserId,
  );

  return kickedMember;
}

module.exports = {
  getAllMembers,
  getSpecificMember,
  updateUserRole,
  kickMember,
  searchUsersByNameOrDisplayName,
  transferOwnership,
};
