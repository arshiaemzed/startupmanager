const errorCodes = require("./errorCodes");

function validateParam(param, res, statusCode, errorMessage) {
  if (!param) {
    return res.status(statusCode).json({
      success: false,
      error: { message: errorMessage, code: errorCodes.INVALID_PARAMETER },
    });
  }
}

module.exports = validateParam;
