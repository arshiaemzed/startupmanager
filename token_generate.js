const jwt = require("jsonwebtoken");
const uuid = require("uuid");

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: 60 * 15 },
  );
}

function genereateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, jti: uuid.v4() },

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
