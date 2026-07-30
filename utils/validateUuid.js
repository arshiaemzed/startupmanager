const { validate } = require("uuid");
const errorCodes = require("./errorCodes");
const AppError = require("../customErrors");

function validateUUID(input, errorMessage) {
  const isValid = validate(input);
  if (!input || !isValid) {
    throw new AppError(400, errorCodes.INVALID_PARAMETER, errorMessage);
  }
}

module.exports = validateUUID;
