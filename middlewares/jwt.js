const jwt = require("jsonwebtoken");
const errorCodes = require("../utils/errorCodes");

function verifyJWT(req, res, next) {
  const header = req.headers;
  const authorization = header.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: {
        message: "No authorization",
        code: errorCodes.NO_AUTHORIZATION,
      },
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: "No token",
        code: errorCodes.NO_ACCESS_TOKEN,
      },
    });
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = userData;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired access token",
        code: errorCodes.INVALID_OR_EXPIRED_ACCESS_TOKEN,
      },
    });
  }
}

module.exports = verifyJWT;
