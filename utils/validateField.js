const AppError = require("../customErrors");
const errorCodes = require("./errorCodes");

function validateField(field, errorMessage) {
  if (!field || typeof field != "string" || field.trim() === "") {
    throw new AppError(400, errorCodes.INVALID_FIELD, errorMessage);
  }
}

module.exports = validateField;
