const { STARTUP_DOESNT_EXIST } = require("../utils/errorCodes");
const validateUUID = require("../utils/validateUuid");

function deleteSingleTaskMiddleware(req, res, next) {
  const startupId = req.params.startupid;

  const taskId = req.params.id;

  validateUUID(startupId, "invalid input for startupid param.");

  validateUUID(taskId, "invalid input for id param.");

  next();
}

module.exports = deleteSingleTaskMiddleware;
