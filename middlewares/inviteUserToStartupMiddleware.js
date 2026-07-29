const validateUUID = require("../utils/validateUuid");

function inviteUserToStartupMiddleware(req, res, next) {
  const memberId = req.params.id;
  const startupId = req.params.startupId;

  validateUUID(memberId, "Invalid input for id param.");
  validateUUID(startupId, "Invalid input for startupId param.");

  next();
}

module.exports = inviteUserToStartupMiddleware;
