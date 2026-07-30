class AppError extends Error {
  constructor(statusCode, errorCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = errorCode;
  }
}

module.exports = AppError;
