const inviteService = require("../services/inviteService");

async function getUserInvites(req, res) {
  const userId = req.user.id;

  const userInvites = await inviteService.getUserInvites(userId);

  return res.status(200).json(userInvites);
}

module.exports = {
  getUserInvites,
};
