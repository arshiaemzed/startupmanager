const validateField = require("../utils/validateField");

function loginMiddleware(req, res, next) {
  const { email, password } = req.body;

  validateField(email, res, "Invalid credentials");
  validateField(password, res, "Invalid credentials");

  next();
}

module.exports = loginMiddleware;
