const errorCodes = require("./errorCodes");

function validateField(field, res, errorMessage) {
  if (!field || field.trim() === "" || typeof field != "string") {
    return res.status(400).json({
      success: false,
      error: { message: errorMessage, code: errorCodes.INVALID_FIELD },
    });
  }
}

module.exports = validateField;
