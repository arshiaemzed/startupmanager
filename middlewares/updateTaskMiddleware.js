const errorCodes = require("../utils/errorCodes");
const AppError = require("../customErrors");
const validateUUID = require("../utils/validateUuid");
const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");
const validateOptionalUuid = require("../utils/validateOptionalUuid");
const validateLength = require("../utils/validateLength");

function updateTaskMiddleware(req, res, next) {
  validateBody(req.body);

  const { status, title, description } = req.body;

  const startupId = req.params.startupid;

  const taskId = req.params.id;

  const assignedTo = req.body.assigned_to;

  validateUUID(startupId, "Invalid input for startupid param.");
  validateUUID(taskId, "Invalid input for id param.");
  validateOptionalUuid(assignedTo, "Invalid input for assigned_to field.");

  validateField(title, "Invalid title.");
  validateField(description, "Invalid description.");
  validateField(status, "Invalid status.");

  validateLength(
    title,
    4,
    255,
    "Title length should be more than 4 and less than 255 characters",
  );

  validateLength(
    description,
    4,
    255,
    "Description length should be more than 4 and less than 255 characters",
  );

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
