const validateParam = require("../utils/validateParam");

function updateMemberRoleMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateParam(startupId, res, 400, "id param missing (Bad request)");

  const memberId = req.params.memberid;

  validateParam(memberId, res, 400, "memberid param missing (Bad request)");

  const newRole = req.body.role;

  if (newRole != "admin" && newRole != "worker") {
    return res
      .status(400)
      .message({ message: "You can only promote users to admin or worker" });
  }

  next();
}

module.exports = updateMemberRoleMiddleware;
