const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function memeberManagmentMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateUUID(startupId, "Invalid input for id param.");

  validateParam(startupId, "id param missing (Bad request)");

  next();
}

module.exports = memeberManagmentMiddleware;
