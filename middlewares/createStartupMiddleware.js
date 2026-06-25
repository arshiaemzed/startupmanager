function createStartupMiddleware(req, res, next) {
  const name = req.body.name;
  const description = req.body.description;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "description is required" });
  }

  next();
}

module.exports = createStartupMiddleware;
