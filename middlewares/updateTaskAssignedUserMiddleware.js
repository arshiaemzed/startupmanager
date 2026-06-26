function updateTaskAssignedUserMiddleware(req, res, next) {
  const taskId = req.params.id;

  const startupId = req.params.startupid;

  const assignedId = req.body.assignedId;

  if (!startupId) {
    return res.status(400).json({ message: "No startupid (Bad request)" });
  }

  if (!taskId) {
    return res.status(400).json({ message: "No id param (Bad request)" });
  }

  if (!assignedId) {
    return res
      .status(400)
      .json({ message: "No assignedId field (Bad request)" });
  }

  next();
}

module.exports = updateTaskAssignedUserMiddleware;
