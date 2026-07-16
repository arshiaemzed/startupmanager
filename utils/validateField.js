const errorCodes = require("./errorCodes");

function validateField(field, res, errorMessage) {
  if (!field || typeof field != "string" || field.trim() === "") {
    return res.status(400).json({
      success: false,
      error: { message: errorMessage, code: errorCodes.INVALID_FIELD },
    });
  }
}

module.exports = validateField;
