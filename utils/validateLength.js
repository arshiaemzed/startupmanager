const AppError = require("../customErrors");
const errorCodes = require("./errorCodes");

function validateLength(input, min, max, message) {
  const errorMessage = message || "Invalid length detected in request body.";

  if (input.length < min || input.lnegth > max) {
    throw new AppError(400, errorCodes.INVALID_LENGTH, errorMessage);
  }
}

module.exports = validateLength;
