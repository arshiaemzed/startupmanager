const validateParam = require("../utils/validateParam");
const validateField = require("../utils/validateField");

function acceptInviteMiddleware(req, res, next) {
  const id = req.params.id;

  validateParam(id, "id param missing(Bad request)");

  const startupId = req.body.startup_id;

  validateField(startupId, "startup_id field missing(Bad request)");

  next();
}

module.exports = acceptInviteMiddleware;
