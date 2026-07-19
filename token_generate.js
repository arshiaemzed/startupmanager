const jwt = require("jsonwebtoken");
require("dotenv").config();

// added 7 day for debugging so i dont have to keep changing my tokens
// change to 15 minutes before production **IMPORTANT**
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, password: user.password },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
}

function genereateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, password: user.password },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

module.exports = {
  generateAccessToken,
  genereateRefreshToken,
};
