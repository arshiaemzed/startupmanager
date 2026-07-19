const inviteService = require("../services/inviteService");

async function getUserInvites(req, res) {
  const userId = req.user.id;

  const userInvites = await inviteService.getUserInvites(userId);

  return res.status(200).json(userInvites);
}

async function acceptInvite(req, res) {
  const inviteId = req.params.id;

  const userId = req.user.id;

  const startupId = req.body.startup_id;

  const acceptedInvite = await inviteService.acceptInvite(
    inviteId,
    startupId,
    userId,
  );

  return res.status(200).json(acceptedInvite);
}

async function declineInvite(req, res) {
  const inviteId = req.params.id;

  const startupId = req.body.startup_id;

  const userId = req.user.id;

  const declinedInvite = await inviteService.declineInvite(
    inviteId,
    startupId,
    userId,
  );

  return res.status(200).json(declinedInvite);
}

async function inviteUserToStartup(req, res, next) {
  const userId = req.user.id;

  const memberId = req.params.id;

  const startupId = req.params.startupid;

  const invitedUser = await inviteService.inviteUserToStartup(
    startupId,
    userId,
    memberId,
  );

  return res.status(200).json(invitedUser);
}

module.exports = {
  getUserInvites,
  acceptInvite,
  declineInvite,
  inviteUserToStartup,
};
