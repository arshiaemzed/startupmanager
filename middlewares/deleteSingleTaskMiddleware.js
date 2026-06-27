const validateParam = require("../utils/validateParam");

function deleteSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  const taskId = req.params.id;

  validateParam(startupId, res, 400, "startup param missing (Bad request)");

  validateParam(taskId, res, 400, "id param missing (Bad request)");

  next();
}

module.exports = deleteSingleTaskMiddleware;
