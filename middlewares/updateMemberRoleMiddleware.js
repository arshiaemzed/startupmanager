function updateMemberRoleMiddleware(req, res, next) {
  const startupId = req.params.id;

  if (!startupId) {
    return res.status(400).json({ message: "No id param (Bad request)" });
  }

  const memberId = req.params.memberid;

  if (!memberId) {
    return res.status(400).json({ message: "No memberid param (Bad request)" });
  }

  const newRole = req.body.role;

  if (newRole != "admin" && newRole != "worker") {
    return res
      .status(400)
      .message({ message: "You can only promote users to admin or worker" });
  }

  next();
}

module.exports = updateMemberRoleMiddleware;
