const errorCodes = require("../utils/errorCodes");
const { validate } = require("uuid");

function validateOptionalUuid(input) {
  const isValid = validate(input);

  if (input && !isValid) {
    throw new AppError(400, errorCodes.INVALID_PARAMETER, errorMessage);
  }
}

module.exports = validateOptionalUuid;
