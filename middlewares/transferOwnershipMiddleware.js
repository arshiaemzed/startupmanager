const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function transferOwnershipMiddleware(req, res, next) {
  const startupId = req.params.id;

  const memberId = req.params.memberid;

  validateUUID(startupId, "Invalid input for id param.");
  validateUUID(startupId, "Invalid input for memberid param.");

  next();
}

module.exports = transferOwnershipMiddleware;
