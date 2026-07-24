const validateParam = require("../utils/validateParam");

function getSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;

  validateParam(startupId, "startupid param missing (Bad request)");

  validateParam(taskId, "id param missing (Bad request)");

  next();
}

module.exports = getSingleTaskMiddleware;
