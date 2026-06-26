const jwt = require("jsonwebtoken");

// added 7 day for debugging so i dont have to keep changing my tokens
// change to 15 minutes before production **IMPORTANT**
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, password: user.password },
    "SECRET_1234",
    { expiresIn: "7d" },
  );
}

function genereateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, password: user.password },
    "REFRESH_SECRET_1234",
    {
      expiresIn: "7d",
    },
  );
}

module.exports = {
  generateAccessToken,
  genereateRefreshToken,
};
