const {
  requireStartup,
  requireNotBeginJoined,
  requireJoining,
  requirePermission,
} = require("../guards/serviceGuard");

const startupRepository = require("../repositories/startupRepository");

async function createNewStartup(name, description, userId) {
  const startup = await startupRepository.createNewStartup(
    name,
    description,
    userId,
  );

  return startup;
}

async function joinStartup(startupId, userId) {
  await requireStartup(startupId);

  await requireNotBeginJoined(startupId, userId);

  const joinedStartup = await startupRepository.joinStartup(startupId, userId);

  return joinedStartup;
}

async function leaveStartup(startupId, userId) {
  await requireStartup(startupId);

  await requireJoining(startupId, userId);

  const userRole = await startupRepository.getUserRole(startupId, userId);

  if (userRole === "owner") {
    return await startupRepository.deleteStartup(startupId);
  }

  const leavedStartup = await startupRepository.leaveStartup(startupId, userId);

  return leavedStartup;
}

async function getUserStartups(userId) {
  const startups = await startupRepository.getUserStartups(userId);

  return startups;
}

async function getStartup(startupId, userId) {
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

  const deletedStartup = await startupRepository.deleteStartup(startupId);

  return deletedStartup;
}
module.exports = {
  createNewStartup,
  deleteStartup,
  joinStartup,
  leaveStartup,
  getUserStartups,
  getStartup,
};
