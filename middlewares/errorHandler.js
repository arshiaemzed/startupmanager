const AppError = require("../customErrors");
const errorCodes = require("../utils/errorCodes");

function errorHandler(err, req, res, next) {
  const message = err.message || "Internal server error";

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: message,
        code: err.code || errorCodes.INTERNAL_SERVER_ERROR,
      },
    });
  }

  console.error(err.message);

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      code: errorCodes.INTERNAL_SERVER_ERROR,
    },
  });
}

module.exports = errorHandler;
