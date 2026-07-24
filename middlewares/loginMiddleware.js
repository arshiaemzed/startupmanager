const validateField = require("../utils/validateField");

function loginMiddleware(req, res, next) {
  const { email, password } = req.body;

  validateField(email, "Invalid credentials");
  validateField(password, "Invalid credentials");

  next();
}

module.exports = loginMiddleware;
