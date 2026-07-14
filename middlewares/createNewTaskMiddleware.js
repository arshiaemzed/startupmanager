const validateField = require("../utils/validateField");
const validateParam = require("../utils/validateParam");

function createNewTaskMiddleware(req, res, next) {
  const startup_id = req.params.id;

  validateParam(startup_id, res, 400, "startup_id param missing (Bad request)");

  const { title, description } = req.body;

  validateField(title, res, "title field missing (Bad request)");

  validateField(description, res, "description field missing (Bad request)");

  next();
}

module.exports = createNewTaskMiddleware;
