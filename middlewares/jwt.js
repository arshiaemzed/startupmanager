const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res
      .status(400)
      .json({ message: "no header was found for this request" });
  }

  if (!header.authorization) {
    return res.status(400).json({ message: "no token" });
  }

  const token = header.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    const userData = jwt.verify(token, "SECRET_1234");
    req.user = userData;
    return next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token or expired token" });
  }
}

module.exports = verifyJWT;
