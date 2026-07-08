const validateParam = require("../utils/validateParam");

function getSpecificMemberMiddleware(req, res, next) {
  const id = req.params.id;

  const memberId = req.params.memberid;

  validateParam(id, res, 400, "id param missing (Bad request)");

  validateParam(memberId, res, 400, "memberid param missing (Bad request)");

  next();
}

module.exports = getSpecificMemberMiddleware;
