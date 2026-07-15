const validateField = require("../utils/validateField");

function searchUsersByNameOrDisplayNameMiddleware(req, res, next) {
  const value = req.body.value;

  validateField(value, res, "Please enter a valid and unique username");
  next();
}

module.exports = searchUsersByNameOrDisplayNameMiddleware;
