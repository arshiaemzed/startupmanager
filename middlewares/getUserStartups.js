const validateField = require("../utils/validateField");

function getUserStartups(req, res, next) {
  const userId = req.user.id;

  validateField(userId, "missing user id (Bad request)");

  next();
}
