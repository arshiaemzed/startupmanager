const validateField = require("../utils/validateField");
const validateParam = require("../utils/validateParam");

function createNewTaskMiddleware(req, res, next) {
  const startup_id = req.params.id;

  validateParam(startup_id, "startup_id param missing (Bad request)");

  const { title, description } = req.body;

  validateField(title, "title field missing (Bad request)");

  validateField(description, "description field missing (Bad request)");

  next();
}

module.exports = createNewTaskMiddleware;
