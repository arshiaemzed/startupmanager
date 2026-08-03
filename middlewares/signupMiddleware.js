const errorCodes = require("../utils/errorCodes");
const validateField = require("../utils/validateField");
const validateBody = require("../utils/validateBody");
const validateEmail = require("../utils/validateEmail");
const validateLength = require("../utils/validateLength");

function signupMiddleware(req, res, next) {
  validateBody(req.body);

  const { name, email, userName, password } = req.body;

  validateField(name, "Please enter valid name");

  validateField(email, "Please enter a valid email");

  validateField(password, "Please enter a valid password");

  validateField(userName, "Please enter a valid and unique username");

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid email format.",
        code: errorCodes.INVALID_EMAIL_FORMAT,
      },
    });
  }

  validateLength(
    name,
    6,
    25,
    "Name length must be more than 6 and less than 25.",
  );

  validateLength(
    password,
    6,
    25,
    "Password length must be more than 6 and less than 255.",
  );

  validateLength(
    userName,
    6,
    25,
    "Username length must be more than 6 and less than 12.",
  );

  if (!validateUsername(userName)) {
    return res.status(400).json({
      success: false,
      error: {
        message: "username can only contains numbers and characters",
        code: errorCodes.INVALID_USERNAME,
      },
    });
  }

  req.body.name = req.body.name;
  req.body.email = req.body.email.trim().toLowerCase();
  req.body.userName = req.body.userName.trim().toLowerCase();
  req.body.password = req.body.password;

  next();
}

function validateUsername(userName) {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (userName.includes(" ")) {
    return false;
  }

  return usernameRegex.test(userName);
}

module.exports = signupMiddleware;
