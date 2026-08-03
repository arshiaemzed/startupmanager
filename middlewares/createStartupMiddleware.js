const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");

function createStartupMiddleware(req, res, next) {
  validateBody(req.body);
  const name = req.body.name;
  const description = req.body.description;

  validateField(name, "Invalid name field(Bad Request)");

  validateField(description, "Invalid description field(Bad Request)");

  validateLength(name, 4, 255, "Invalid length for name(MIN: 4, MAX: 255).");

  validateLength(
    description,
    4,
    255,
    "Invalid length for description(MIN: 4, MAX: 255).",
  );

  next();
}

module.exports = createStartupMiddleware;
