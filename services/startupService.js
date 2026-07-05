const {
  requireStartup,
  requireNotBeginJoined,
  requireJoining,
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

module.exports = {
  createNewStartup,
  joinStartup,
  leaveStartup,
  getUserStartups,
  getStartup,
};
