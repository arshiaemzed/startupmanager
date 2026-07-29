const validateUUID = require("../utils/validateUuid");

function getStartupMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateUUID(startupId, "invalid input for id param.");

  next();
}

module.exports = getStartupMiddleware;
