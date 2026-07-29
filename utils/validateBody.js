const AppError = require("../customErrors");
const errorCodes = require("./errorCodes");

function validateBody(httpRequestBody) {
  if (!httpRequestBody || typeof httpRequestBody != "object") {
    throw new AppError(
      400,
      errorCodes.INVALID_REQUEST_BODY,
      "Invalid request body.",
    );
  }
}

module.exports = validateBody;
