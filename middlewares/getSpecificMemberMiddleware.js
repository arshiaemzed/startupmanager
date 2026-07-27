const validateParam = require("../utils/validateParam");
const validateUUID = require("../utils/validateUuid");

function getSpecificMemberMiddleware(req, res, next) {
  const id = req.params.id;

  const memberId = req.params.memberid;

  validateUUID(id, "Invalid input for id param.");
  validateUUID(memberId, "Invalid input for memberid param.");

  validateParam(id, "id param missing (Bad request)");

  validateParam(memberId, "memberid param missing (Bad request)");

  next();
}

module.exports = getSpecificMemberMiddleware;
