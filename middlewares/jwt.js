const jwt = require("jsonwebtoken");
const errorCodes = require("../utils/errorCodes");

function verifyJWT(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({
      success: false,
      error: { message: "No header (Bad request)", code: errorCodes.NO_HEADER },
    });
  }

  const authorization = header.authorization;

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

  if (!token) {
    return res.status(400).json({
      success: false,
      error: {
        message: "No token (Bad request)",
        code: errorCodes.NO_ACCESS_TOKEN,
      },
    });
  }

  try {
    const userData = jwt.verify(token, "SECRET_1234");
    req.user = userData;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired access token",
        code: errorCodes.INVALID_OR_EXIPRED_ACCESS_TOKEN,
      },
    });
  }
}

module.exports = verifyJWT;
