const errorCodes = require("../utils/errorCodes");

function errorHandler(err, req, res, next) {
  const message = err.message || "Internal server error";

  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: message,
      code: err.errorCode || errorCodes.INTERNAL_SERVER_ERROR,
    },
  });
}

module.exports = errorHandler;
