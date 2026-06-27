function createStartupMiddleware(req, res, next) {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || name.trim() === "" || typeof name != "string") {
    return res.status(400).json({
      success: false,
      error: { message: "No name field (Bad request)", code: 400 },
    });
  }

  if (
    !description ||
    description.trim() === "" ||
    typeof description != "string"
  ) {
    return res.status(400).json({
      success: false,
      error: { message: "No description field (Bad request)", code: 400 },
    });
  }

  next();
}

module.exports = createStartupMiddleware;
