const validateField = require("../utils/validateField");

function createStartupMiddleware(req, res, next) {
  const name = req.body.name;
  const description = req.body.description;

  validateField(name, "Invalid name field(Bad Request)");

  validateField(description, "Invalid description field(Bad Request)");

  next();
}

module.exports = createStartupMiddleware;
