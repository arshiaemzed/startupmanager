const validateField = require("../utils/validateField");

function createStartupMiddleware(req, res, next) {
  const name = req.body.name;
  const description = req.body.description;

  validateField(name, "name field missing (Bad request)");

  validateField(description, "description field missing (Bad request)");

  next();
}

module.exports = createStartupMiddleware;
