const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");
function declineInviteMiddleware(req, res, next) {
  validateBody(req.body);

  const startupId = req.body.startup_id;
  const id = req.params.id;

  validateField(startupId, "startup_id field missing(Bad request)");

  next();
}

module.exports = declineInviteMiddleware;
