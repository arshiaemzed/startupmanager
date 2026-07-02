function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    error: { message: message, code: statusCode },
  });
}

module.exports = errorHandler;
