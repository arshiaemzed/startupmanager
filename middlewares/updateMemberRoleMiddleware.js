const errorCodes = require("../utils/errorCodes");
const validateParam = require("../utils/validateParam");

function updateMemberRoleMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateParam(startupId, res, 400, "id param missing (Bad request)");

  const memberId = req.params.memberid;

  validateParam(memberId, res, 400, "memberid param missing (Bad request)");

  const newRole = req.body.role;

  if (newRole != "admin" && newRole != "worker") {
    return res.status(400).json({
      success: false,
      error: {
        message: "You can only promote users to admin or worker",
        code: errorCodes.CAN_ONLY_PROMOTE_TO_ADMIN_OR_WORKER,
      },
    });
  }

  next();
}

module.exports = updateMemberRoleMiddleware;
