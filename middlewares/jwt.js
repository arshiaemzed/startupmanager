const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({ message: "No header (Bad request)" });
  }

  const authorization = header.authorization;

  if (!authorization) {
    return res.status(400).json({ message: "No authorization (Bad request)" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token (Bad request)" });
  }

  try {
    const userData = jwt.verify(token, "SECRET_1234");
    req.user = userData;
    return next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyJWT;
