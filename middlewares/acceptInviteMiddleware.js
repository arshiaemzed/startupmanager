const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");

function acceptInviteMiddleware(req, res, next) {
  validateBody(req.body);

  const id = req.params.id;

  const startupId = req.body.startup_id;

  validateField(startupId, "startup_id field missing(Bad request)");

  next();
}

module.exports = acceptInviteMiddleware;
