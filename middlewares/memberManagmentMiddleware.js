const validateUUID = require("../utils/validateUuid");

function memeberManagmentMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateUUID(startupId, "Invalid input for id param.");

  next();
}

module.exports = memeberManagmentMiddleware;
