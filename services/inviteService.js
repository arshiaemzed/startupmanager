const AppError = require("../customErrors");
const inviteRepository = require("../repositories/inviteRepository");
const errorCodes = require("../utils/errorCodes");
const {
  requireJoining,
  requireStartup,
  requirePermission,
} = require("../guards/serviceGuard");

async function getUserInvites(userId) {
  const userInvites = await inviteRepository.getUserInvites(userId);

  return userInvites;
}

async function acceptInvite(inviteId, startupId, userId) {
  await requireStartup(startupId);

  const alreadyInStartup = await inviteRepository.isUserInStartup(
    startupId,
    userId,
  );

  if (alreadyInStartup) {
    throw new AppError(
      400,
      errorCodes.ALREADY_JOINED_STARTUP,
      "You are already joined in startup.",
    );
  }

  const validInvite = await inviteRepository.verifyInvite(
    inviteId,
    startupId,
    userId,
  );

  if (!validInvite) {
    throw new AppError(400, errorCodes.INVALID_INVITE, "Invalid invite.");
  }

  const acceptedInvite = await inviteRepository.acceptInvite(
    inviteId,
    startupId,
    userId,
  );

  return acceptedInvite;
}

async function declineInvite(inviteId, startupId, userId) {
  await requireStartup(startupId);

  const alreadyInStartup = await inviteRepository.isUserInStartup(
    startupId,
    userId,
  );

  if (alreadyInStartup) {
    throw new AppError(
      400,
      errorCodes.ALREADY_JOINED_STARTUP,
      "You are already joined in startup.",
    );
  }

  const validInvite = await inviteRepository.verifyInvite(
    inviteId,
    startupId,
    userId,
  );

  if (!validInvite) {
    throw new AppError(400, errorCodes.INVALID_INVITE, "Invalid invite.");
  }

  const declinedInvite = await inviteRepository.declineInvite(
    inviteId,
    startupId,
    userId,
  );

  return declinedInvite;
}

async function inviteUserToStartup(startupId, userId, memberId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  await requirePermission(startupId, userId, ["owner"]);

  const alreadyJoined = await inviteRepository.isUserInStartup(
    startupId,
    memberId,
  );

  if (alreadyJoined) {
    throw new AppError(
      400,
      errorCodes.INVITED_USER_ALREADY_JOINED,
      "User is already joined in startup.",
    );
  }

  const alreadyInvited = await inviteRepository.userAlreadyInvited(
    startupId,
    memberId,
  );

  if (alreadyInvited) {
    throw new AppError(
      409,
      errorCodes.USER_ALREADY_INVITED_TO_STARTUP,
      "User is already invited to the startup.",
    );
  }

  const invitedUser = await inviteRepository.inviteUserToStartup(
    startupId,
    userId,
    memberId,
  );

  return invitedUser;
}

module.exports = {
  getUserInvites,
  acceptInvite,
  declineInvite,
  inviteUserToStartup,
};
