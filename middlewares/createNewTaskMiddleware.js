const AppError = require("../customErrors");
const errorCodes = require("../utils/errorCodes");
const validateField = require("../utils/validateField");
const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function createNewTaskMiddleware(req, res, next) {
  const startup_id = req.params.id;

  validateParam(startup_id, "startup_id param missing (Bad request)");

  if (!req.body) {
    throw new AppError(
      400,
      errorCodes.INVALID_REQUEST_BODY,
      "Invalid request body.",
    );
  }

  const title = req.body.title;
  const description = req.body.description;

  validateUUID(startup_id, "invalid input for id param.");

  validateField(title, "title field missing (Bad request)");

  validateField(description, "description field missing (Bad request)");

  next();
}

module.exports = createNewTaskMiddleware;
