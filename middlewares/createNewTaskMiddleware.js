const AppError = require("../customErrors");
const errorCodes = require("../utils/errorCodes");
const validateBody = require("../utils/validateBody");
const validateField = require("../utils/validateField");
const validateOptionalUuid = require("../utils/validateOptionalUuid");
const validateUUID = require("../utils/validateUuid");

function createNewTaskMiddleware(req, res, next) {
  validateBody(req.body);

  const title = req.body.title;
  const assignedTo = req.body.assigned_to;
  const description = req.body.description;
  const status = req.body.status;
  const startup_id = req.params.id;

  validateUUID(startup_id, "invalid input for id param.");
  validateOptionalUuid(assignedTo, "invalid input for assigned_to field.");

  validateField(title, "title field missing (Bad request)");

  validateField(description, "description field missing (Bad request)");

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

module.exports = createNewTaskMiddleware;
