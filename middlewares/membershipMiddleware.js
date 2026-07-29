const validateUUID = require("../utils/validateUuid");

function membershipMiddleware(req, res, next) {
  const id = req.params.id;

  validateUUID(id, "invalid input for id param.");

  next();
}

module.exports = membershipMiddleware;
