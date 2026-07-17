const inviteRepository = require("../repositories/inviteRepository");

async function getUserInvites(userId) {
  const userInvites = await inviteRepository.getUserInvites(userId);

  return userInvites;
}

module.exports = {
  getUserInvites,
};
