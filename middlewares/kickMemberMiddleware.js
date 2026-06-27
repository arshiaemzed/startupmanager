const validateParam = require("../utils/validateParam");

function kickMemberMiddleware(req, res, next) {
  const startupId = req.params.id;

  validateParam(startupId, res, 400, "id param missing (Bad request");

  const affectedUserId = req.params.memberid;

  validateParam(
    affectedUserId,
    res,
    400,
    "memberid param missing (Bad request)",
  );

  next();
}

module.exports = kickMemberMiddleware;
