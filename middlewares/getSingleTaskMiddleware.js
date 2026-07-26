const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function getSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;

  validateUUID(startupId, "invalid input for startupid param.");

  validateUUID(taskId, "invalid input for id param.");

  validateParam(startupId, "startupid param missing (Bad request)");

  validateParam(taskId, "id param missing (Bad request)");

  next();
}

module.exports = getSingleTaskMiddleware;
