function kickMemberMiddleware(req, res, next) {
  const startupId = req.params.id;

  if (!startupId) {
    return res.status(400).json({ message: "No id param (Bad request)" });
  }

  const affectedUserId = req.params.memberid;

  if (!affectedUserId) {
    return res.status(400).json({ message: "No memberid param (Bad request)" });
  }

  next();
}

module.exports = kickMemberMiddleware;
