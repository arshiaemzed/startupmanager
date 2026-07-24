const validateField = require("../utils/validateField");
const validateParam = require("../utils/validateParam");

function updateTaskAssignedUserMiddleware(req, res, next) {
  const taskId = req.params.id;

  const startupId = req.params.startupid;

  const assignedId = req.body.assignedId;

  validateParam(startupId, "startupid param missing (Bad request)");

  validateParam(taskId, "id param missing (Bad request)");

  validateField(assignedId, "Invalid id for assigned user");

  next();
}

module.exports = updateTaskAssignedUserMiddleware;
