const { validate } = require("uuid");
const errorCodes = require("./errorCodes");

function validateUUID(input, res, errorMessage) {
  const isValid = validate(input);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: {
        message: errorMessage,
        code: errorCodes.INVALID_PARAMETER,
      },
    });
  }
}

module.exports = validateUUID;
