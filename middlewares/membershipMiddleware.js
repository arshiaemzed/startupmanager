function membershipMiddleware(req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "id param missing (Bad request)" });
  }

  next();
}

module.exports = membershipMiddleware;
