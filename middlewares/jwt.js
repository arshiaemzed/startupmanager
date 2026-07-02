const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({
      success: false,
      error: { message: "No header (Bad request)", code: 400 },
    });
  }

  const authorization = header.authorization;

  if (!authorization) {
    return res.status(400).json({
      success: false,
      error: { message: "No authorization (Bad request)", code: 400 },
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      success: false,
      error: { message: "No token (Bad request)", code: 400 },
    });
  }

  try {
    const userData = jwt.verify(token, "SECRET_1234");
    req.user = userData;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: "Invalid or expired token", code: 400 },
    });
  }
}

module.exports = verifyJWT;
