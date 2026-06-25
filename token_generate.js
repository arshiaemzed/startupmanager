const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, password: user.password },
    "SECRET_1234",
    { expiresIn: 60 * 24 * 30 },
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
