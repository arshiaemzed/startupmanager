const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");

function createStartupMiddleware(req, res, next) {
  validateBody(req.body);
  const name = req.body.name;
  const description = req.body.description;

  validateField(name, "Invalid name field(Bad Request)");

  validateField(description, "Invalid description field(Bad Request)");

  next();
}

module.exports = createStartupMiddleware;
