const errorCodes = require("../utils/errorCodes");

function refreshTokenMiddleware(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({
      success: false,
      error: { message: "No header (Bad request)", code: errorCodes.NO_HEADER },
    });
  }

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({
      success: false,
      error: {
        message: "No authorization (Bad request)",
        code: errorCodes.NO_AUTHORIZATION,
      },
    });
  }

  const token = authorization.split(" ")[1];

  if (!token || token.trim() === "") {
    return res.status(400).json({
      success: false,
      error: {
        message: "No token (Bad request)",
        code: errorCodes.NO_REFRESH_TOKEN,
      },
    });
  }

  next();
}

module.exports = refreshTokenMiddleware;
