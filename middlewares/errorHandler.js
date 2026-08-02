const AppError = require("../customErrors");
const errorCodes = require("../utils/errorCodes");

const PG_ERRORS = {
  23505: { status: 409, message: "Resource already exists" },
  23503: { status: 404, message: "Referenced resource does not exist" },
  23502: { status: 400, message: "Missing required field" },
  23514: { status: 400, message: "Value is not allowed" },
  "22P02": { status: 400, message: "Malformed value in request" },
  22001: { status: 400, message: "Value is too long" },
};
function errorHandler(err, req, res, next) {
  const message = err.message || "Internal server error";

  const pgError = PG_ERRORS[err.code];

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: message,
        code: err.code || errorCodes.INTERNAL_SERVER_ERROR,
      },
    });
  }

  if (pgError) {
    return res.status(pgError.status).json({
      success: false,
      error: {
        message: pgError.message,
        code: errorCodes.PG_ERROR,
      },
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: {
        message: "Malformed JSON in request body.",
        code: errorCodes.MALFORMED_JSON_REQUEST_BODY,
      },
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: {
        message: "Payload too large.",
        code: errorCodes.PAYLOAD_TOO_LARGE,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      code: errorCodes.INTERNAL_SERVER_ERROR,
    },
  });
}

module.exports = errorHandler;
