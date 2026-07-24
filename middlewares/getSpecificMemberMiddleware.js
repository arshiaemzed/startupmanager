const validateParam = require("../utils/validateParam");

function getSpecificMemberMiddleware(req, res, next) {
  const id = req.params.id;

  const memberId = req.params.memberid;

  validateParam(id, "id param missing (Bad request)");

  validateParam(memberId, "memberid param missing (Bad request)");

  next();
}

module.exports = getSpecificMemberMiddleware;
