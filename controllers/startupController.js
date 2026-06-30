const startupService = require("../services/startupService");

async function createNewStartup(req, res, next) {
  const { name, description } = req.body;

  const userId = req.user.id;

  const newStartup = await startupService.createNewStartup(
    name,
    description,
    userId,
  );

  return res.status(201).json(newStartup);
}

async function joinStartup(req, res, next) {
  const startupId = req.params.id;
  const userId = req.user.id;

  const joinedStartup = await startupService.joinStartup(startupId, userId);

  return res.status(200).json(joinedStartup);
}

async function leaveStartup(req, res, next) {
  const startupId = req.params.id;
  const userId = req.user.id;

  const leavedStartup = await startupService.leaveStartup(startupId, userId);

  return res.status(200).json(leavedStartup);
}

async function getUserStartups(req, res, next) {
  const userId = req.user.id;

  const startups = await startupService.getUserStartups(userId);

  return res.status(200).json(startups);
}

module.exports = {
  createNewStartup,
  joinStartup,
  leaveStartup,
  getUserStartups,
};
