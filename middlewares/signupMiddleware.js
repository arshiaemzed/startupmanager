const errorCodes = require("../utils/errorCodes");
const validateField = require("../utils/validateField");

function signupMiddleware(req, res, next) {
  const { email, password, name, userName } = req.body;

  validateField(name, res, "Please enter valid name");

  validateField(email, res, "Please enter a valid email");

  validateField(password, res, "Please enter a valid password");

  validateField(userName, res, "Please enter a valid and unique username");

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

  if (!validateUsername(userName)) {
    return res.status(400).json({
      success: false,
      error: { message: "username can only contains numbers and characters" },
    });
  }

  next();
}

function validateUsername(userName) {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(userName);
}

module.exports = signupMiddleware;
