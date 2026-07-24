const AppError = require("../customErrors");
const errorCodes = require("./errorCodes");

function validateParam(param, errorMessage) {
  if (!param) {
    throw new AppError(400, errorCodes.INVALID_PARAMETER, errorMessage);
  }
}

module.exports = validateParam;
