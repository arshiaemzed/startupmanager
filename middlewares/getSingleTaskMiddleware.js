const validateUUID = require("../utils/validateUuid");

function getSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;

  validateUUID(startupId, "invalid input for startupid param.");

  validateUUID(taskId, "invalid input for id param.");

  next();
}

module.exports = getSingleTaskMiddleware;
