const errorCodes = require("../utils/errorCodes");
const validateField = require("../utils/validateField");

function signupMiddleware(req, res, next) {
  const { email, password, name } = req.body;

  validateField(name, res, 400, "Please enter valid name");

  validateField(email, res, 400, "Please enter an valid email");

  validateField(email, res, 400, "Please enter an valid password");

  if (name.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        message: "name length must be more than 6",
        code: errorCodes.INVALID_NAME_LENGTH,
      },
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Password length must be more than 6",
        code: errorCodes.INVALID_PASSWORD_LENGTH,
      },
    });
  }

  next();
}

module.exports = signupMiddleware;
