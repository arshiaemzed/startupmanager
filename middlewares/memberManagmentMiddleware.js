function memeberManagmentMiddleware(req, res, next) {
  const startupId = req.params.id;

  if (!startupId) {
    return res.status(400).json({ message: "No id param (Bad request)" });
  }

  next();
}

module.exports = memeberManagmentMiddleware;
