const validateParam = require("../utils/validateParam");

function kickMemberMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateParam(startupId, "id param missing (Bad request)");

  const affectedUserId = req.params.memberid;

  validateParam(affectedUserId, "memberid param missing (Bad request)");

  next();
}

module.exports = kickMemberMiddleware;
