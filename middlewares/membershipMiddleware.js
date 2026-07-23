const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function membershipMiddleware(req, res, next) {
  const id = req.params.id;

  validateUUID(id, res, "invalid input for id param.");

  validateParam(id, res, 400, "id param missing (Bad request)");

  next();
}

module.exports = membershipMiddleware;
