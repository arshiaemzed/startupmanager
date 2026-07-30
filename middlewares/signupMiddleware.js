const errorCodes = require("../utils/errorCodes");
const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");

function signupMiddleware(req, res, next) {
  validateBody(req.body);

  const { name, email, userName, password } = req.body;

  validateField(name, "Please enter valid name");

  validateField(email, "Please enter a valid email");

  validateField(password, "Please enter a valid password");

  validateField(userName, "Please enter a valid and unique username");

  if (name.length <= 6 || name.length > 25) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Name length must be more than 6 and less than 25",
        code: errorCodes.INVALID_NAME_LENGTH,
      },
    });
  }

  if (password.length <= 6 || password.length > 255) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Password length must be more than 6 and less than 255.",
        code: errorCodes.INVALID_PASSWORD_LENGTH,
      },
    });
  }

  if (userName.length <= 6 || userName.length > 12) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Username length must be more than 6 and less than 12",
        code: errorCodes.INVALID_USERNAME_LENGTH,
      },
    });
  }

  if (!validateUsername(userName)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "username can only contains numbers and characters",
        code: errorCodes.INVALID_USERNAME,
      },
    });
  }

  req.body.name = String(req.body.name);
  req.body.email = String(req.body.email).trim().toLowerCase();
  req.body.userName = String(req.body.name).trim().toLowerCase();
  req.body.password = String(req.body.name).trim();

  next();
}

function validateUsername(userName) {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(userName);
}

module.exports = signupMiddleware;
