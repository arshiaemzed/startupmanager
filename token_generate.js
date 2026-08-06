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
  const jti = uuid.v4();

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, jti: jti },

    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return { jti: jti, refreshToken: refreshToken };
}

module.exports = {
  generateAccessToken,
  genereateRefreshToken,
};
