function validateParam(param, res, statusCode, errorMessage) {
  if (!param) {
    return res.status(statusCode).json({
      success: false,
      error: { message: errorMessage, code: statusCode },
    });
  }
}

module.exports = validateParam;
