const errorCodes = require("../utils/errorCodes");
const validateBody = require("../utils/validateBody");
const validateField = require("../utils/validateField");

function updateMemberRoleMiddleware(req, res, next) {
  validateBody(req.body);

  const memberId = req.params.memberid;

  const startupId = req.params.id;
  const newRole = req.body.role;

  validateField(newRole, "role field missing(Bad request)");

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
