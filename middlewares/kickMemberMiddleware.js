const validateUUID = require("../utils/validateUuid");

function kickMemberMiddleware(req, res, next) {
  const startupId = req.params.id;

  const affectedUserId = req.params.memberid;

  validateUUID(startupId, "Invalid input for id param.");
  validateUUID(affectedUserId, "Invalid input for memberid param.");

  next();
}

module.exports = kickMemberMiddleware;
