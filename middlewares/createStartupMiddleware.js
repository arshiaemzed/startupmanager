function createStartupMiddleware(req, res, next) {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || name.trim() === "" || typeof name != "string") {
    return res
      .status(400)
      .json({ message: "name field missing (Bad request)" });
  }

  if (
    !description ||
    description.trim() === "" ||
    typeof description != "string"
  ) {
    return res
      .status(400)
      .json({ message: "description field missing (Bad request)" });
  }

  next();
}

module.exports = createStartupMiddleware;
