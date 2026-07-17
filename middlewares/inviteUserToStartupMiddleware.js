const validateParam = require("../utils/validateParam");

function inviteUserToStartupMiddleware(req, res, next) {
  const memberId = req.params.id;

  validateParam(memberId, res, 400, "id param missing (Bad Request)");

  const startupId = req.params.startupId;

  validateParam(memberId, res, 400, "startupid param missing (Bad Request)");

  next();
}

module.exports = inviteUserToStartupMiddleware;
