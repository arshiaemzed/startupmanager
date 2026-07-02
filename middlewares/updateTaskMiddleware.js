const validateParam = require("../utils/validateParam");

function updateTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  validateParam(startupId, res, 400, "startupid param missing (Bad request)");

  const taskId = req.params.id;

  validateParam(taskId, res, 400, "id param missing (Bad request)");

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
        code: 400,
      },
    });
  }
  next();
}

module.exports = updateTaskMiddleware;
