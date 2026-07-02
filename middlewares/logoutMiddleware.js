function logoutMiddleware(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({
      success: false,
      error: { message: "No header (Bad request)", code: 400 },
    });
  }

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({
      success: false,
      error: { message: "No authorization (Bad request)", code: 400 },
    });
  }

  const token = header.authorization.split(" ")[1];

  if (!token || token.trim() === "") {
    return res.status(400).json({
      success: false,
      error: { message: "No token (Bad request)", code: 400 },
    });
  }

  next();
}

module.exports = logoutMiddleware;
