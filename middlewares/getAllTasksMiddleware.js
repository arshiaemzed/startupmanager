const validateParam = require("../utils/validateParam");

function getAllTasksMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateParam(startupId, res, 400, "id param missing (Bad request)");

  next();
}

module.exports = getAllTasksMiddleware;
