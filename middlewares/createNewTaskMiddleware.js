function createNewTaskMiddleware(req, res, next) {
  const { title, description } = req.body;

  const startup_id = req.params.id;

  if (!startup_id) {
    return res
      .status(400)
      .json({ message: "startup_id param missing (Bad request)" });
  }

  if (!title || title.trim() === "" || typeof title != "string") {
    return res
      .status(400)
      .json({ message: "title field missing (Bad request)" });
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

module.exports = createNewTaskMiddleware;
