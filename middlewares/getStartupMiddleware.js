const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function getStartupMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateUUID(startupId, "invalid input for id param.");

  validateParam(startupId, "id param missing (Bad request)");

  next();
}

module.exports = getStartupMiddleware;
