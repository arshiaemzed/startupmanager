const errorCodes = require("../utils/errorCodes");
const validateParam = require("../utils/validateParam");

function updateTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  validateParam(startupId, "startupid param missing (Bad request)");

  const taskId = req.params.id;

  validateParam(taskId, "id param missing (Bad request)");

  const status = req.body.status;

  if (
    status &&
    status != "todo" &&
    status != "in_progress" &&
    status != "done"
  ) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Status can only be 'todo', 'in_progress', and 'done'",
        code: errorCodes.INVALID_TASK_STATUS,
      },
    });
  }
  next();
}

module.exports = updateTaskMiddleware;
