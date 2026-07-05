const errorCodes = require("./errorCodes");

function validateField(field, res, statusCode, errorMessage) {
  if (!field || field.trim() === "" || typeof field != "string") {
    return res.status(statusCode).json({
      success: false,
      error: { message: errorMessage, code: errorCodes.INVALID_FIELD },
    });
  }
}

module.exports = validateField;
