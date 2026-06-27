const validateField = require("../utils/validateField");

function loginMiddleware(req, res, next) {
  const { email, password } = req.body;

  validateField(email, res, 400, "Invalid credentials");
  validateField(password, res, 400, "Invalid credentials");

  next();
}

module.exports = loginMiddleware;
