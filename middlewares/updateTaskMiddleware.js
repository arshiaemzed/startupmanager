const errorCodes = require("../utils/errorCodes");
const validateParam = require("../utils/validateParam");
const AppError = require("../customErrors");
const validateUuid = require("../utils/validateUuid");
const validateField = require("../utils/validateField");

function updateTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  validateUuid(startupId, "Invalid input for startupid param.");

  validateParam(startupId, "startupid param missing (Bad request)");

  const taskId = req.params.id;

  validateUuid(taskId, "Invalid input for id param.");

  validateParam(taskId, "id param missing (Bad request)");

  if (!req.body) {
    throw new AppError(
      400,
      errorCodes.INVALID_REQUEST_BODY,
      "Invalid request body.",
    );
  }

  const { status, title, description } = req.body;

  validateField(title, "Invalid title.");
  validateField(description, "Invalid description.");
  validateField(status, "Invalid status.");

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
