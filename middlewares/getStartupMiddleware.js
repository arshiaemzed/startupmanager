const validateParam = require("../utils/validateParam");

function getStartupMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateParam(startupId, "id param missing (Bad request)");

  next();
}

module.exports = getStartupMiddleware;
