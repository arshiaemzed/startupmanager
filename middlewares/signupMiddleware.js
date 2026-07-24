const errorCodes = require("../utils/errorCodes");
const validateField = require("../utils/validateField");

function signupMiddleware(req, res, next) {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      error: {
        code: errorCodes.INVALID_REQUEST_BODY,
        message: "Invalid request body.",
      },
    });
  }

  const { email, password, name, userName } = req.body;

  validateField(name, "Please enter valid name");

  validateField(email, "Please enter a valid email");

  validateField(password, "Please enter a valid password");

  validateField(userName, "Please enter a valid and unique username");

  if (name.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Name length must be more than 6",
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

  if (userName.length < 6) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Username length must be more than 6",
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

  next();
}

function validateUsername(userName) {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(userName);
}

module.exports = signupMiddleware;
