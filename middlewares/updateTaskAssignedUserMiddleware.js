const validateField = require("../utils/validateField");
const validateParam = require("../utils/validateParam");

function updateTaskAssignedUserMiddleware(req, res, next) {
  const taskId = req.params.id;

  const startupId = req.params.startupid;

  const assignedId = req.body.assignedId;

  validateParam(startupId, res, "startupid param missing (Bad request)");

  validateParam(taskId, res, "id param missing (Bad request)");

  validateField(assignedId, res, "Invalid id for assigned user");

  next();
}

module.exports = updateTaskAssignedUserMiddleware;
