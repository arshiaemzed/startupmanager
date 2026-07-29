const validateUUID = require("../utils/validateUuid");

function getSpecificMemberMiddleware(req, res, next) {
  const id = req.params.id;

  const memberId = req.params.memberid;

  validateUUID(id, "Invalid input for id param.");
  validateUUID(memberId, "Invalid input for memberid param.");

  next();
}

module.exports = getSpecificMemberMiddleware;
