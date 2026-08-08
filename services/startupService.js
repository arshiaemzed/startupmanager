const AppError = require("../customErrors");
const {
  requireStartup,
  requireNotBeginJoined,
  requireJoining,
  requirePermission,
  requireInvite,
} = require("../guards/serviceGuard");

const startupRepository = require("../repositories/startupRepository");
const errorCodes = require("../utils/errorCodes");

async function createNewStartup(name, description, userId) {
  const startup = await startupRepository.createNewStartup(
    name,
    description,
    userId,
  );

  return startup;
}

async function leaveStartup(startupId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const userRole = await startupRepository.getUserRole(startupId, userId);

  if (userRole === "owner") {
    throw new AppError(
      401,
      errorCodes.NEED_TO_TRASNFER_OWNERSHIP_BEFORE_LEAVE,
      "You need to transfer ownership before leaving startup",
    );
  }

  const leavedStartup = await startupRepository.leaveStartup(startupId, userId);

  return leavedStartup;
}

async function getUserStartups(userId) {
  const startups = await startupRepository.getUserStartups(userId);

  return startups;
}

async function getStartup(startupId, userId) {
  await requireStartup(startupId);
  await requireJoining(startupId, userId);
  const startup = await startupRepository.getStartup(startupId);
  return startup;
}

async function deleteStartup(startupId, userId) {
  await requireStartup(startupId);
  await requireJoining(startupId, userId);
  await requirePermission(
    startupId,
    userId,
    ["owner"],
    "Only owner's can delete startups.",
  );

  await startupRepository.deleteStartup(startupId);
}
module.exports = {
  createNewStartup,
  deleteStartup,
  leaveStartup,
  getUserStartups,
  getStartup,
};
