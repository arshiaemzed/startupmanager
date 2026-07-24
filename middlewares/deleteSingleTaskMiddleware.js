const validateParam = require("../utils/validateParam");

function deleteSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  const taskId = req.params.id;

  validateParam(startupId, "startup param missing (Bad request)");

  validateParam(taskId, "id param missing (Bad request)");

  next();
}

module.exports = deleteSingleTaskMiddleware;
