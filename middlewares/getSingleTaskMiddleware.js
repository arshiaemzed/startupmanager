function getSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;
  const taskId = req.params.id;

  if (!startupId) {
    return res
      .status(400)
      .json({ message: "No startupid param (Bad request)" });
  }

  if (!taskId) {
    return res.status(400).json({ message: "No id param (Bad request)" });
  }

  next();
}

module.exports = getSingleTaskMiddleware;
