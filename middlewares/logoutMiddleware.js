function logoutMiddleware(req, res, next) {
  const header = req.headers;

  if (!header) {
    return res.status(400).json({ message: "No header (Bad request)" });
  }

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({ message: "No authorization (Bad Request)" });
  }

  const token = header.authorization.split(" ")[1];

  if (!token || token.trim() === "") {
    return res.status(400).json({ message: "No token (Bad request)" });
  }

  next();
}

module.exports = logoutMiddleware;
