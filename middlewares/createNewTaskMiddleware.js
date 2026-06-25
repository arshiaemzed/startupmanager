function createNewTaskMiddleware(req, res, next) {
  const { title, description } = req.body;

  const startup_id = req.params.id;

  if (!title) {
    return res.status(400).json({ message: "title is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "description is required" });
  }

  if (!startup_id) {
    return res.status(400).json({ message: "startup_id is required" });
  }

  next();
}

module.exports = createNewTaskMiddleware;
