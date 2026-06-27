const validateParam = require("../utils/validateParam");

function membershipMiddleware(req, res, next) {
  const id = req.params.id;

  validateParam(id, res, 400, "id param missing (Bad request)");

  next();
}

module.exports = membershipMiddleware;
