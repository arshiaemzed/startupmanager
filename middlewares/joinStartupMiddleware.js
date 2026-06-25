function joinStartupMiddleware(req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res
      .status(400)
      .json({ message: "id is required for joining an startup" });
  }

  next();
}

module.exports = joinStartupMiddleware;
