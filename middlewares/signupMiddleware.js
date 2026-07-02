const validateField = require("../utils/validateField");

function signupMiddleware(req, res, next) {
  const { email, password } = req.body;

  validateField(email, res, 400, "Please enter an valid email");

  validateField(email, res, 400, "Please enter an valid password");

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: { message: "Password length must be more than 6", code: 400 },
    });
  }

  next();
}

module.exports = signupMiddleware;
