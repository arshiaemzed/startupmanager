const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");
const validateUUID = require("../utils/validateUuid");
function declineInviteMiddleware(req, res, next) {
  validateBody(req.body);

  const startupId = req.body.startup_id;
  const id = req.params.id;

  validateUUID(id, "Invalid input for id param.");
  validateField(startupId, "startup_id field missing(Bad request)");

  next();
}

module.exports = declineInviteMiddleware;
