function updateTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  if (!startupId) {
    return res
      .status(400)
      .json({ message: "No startupid param (Bad request)" });
  }
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({ message: "No id param (Bad request)" });
  }

  const status = req.body.status;

  console.log(status);

  if (
    status &&
    status != "todo" &&
    status != "in_progress" &&
    status != "done"
  ) {
    return res.status(400).json({
      message: "Status can only be 'todo', 'in_progress', and 'done'",
    });
  }
  next();
}

module.exports = updateTaskMiddleware;
