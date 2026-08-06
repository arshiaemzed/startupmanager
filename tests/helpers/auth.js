const jwt = require("jsonwebtoken");
const db = require("../../database/db");
const bcrypt = require("bcrypt");

async function createTestUser(overrides = {}) {
  const newUser = {
    email: "testaccount@gmail.com",
    password: "test1234",
    name: "Test",
    userName: "test_account",
    ...overrides,
  };

  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const result = await db.query(
    `
        INSERT INTO users
        (email, password, name, user_name)
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `,
    [newUser.email, hashedPassword, newUser.name, newUser.userName],
  );

  return {
    id: result.rows[0].id,
    email: newUser.email,
    password: newUser.password,
  };
}

async function createAccessToken(id) {
  const token = jwt.sign({ id: id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return token;
}

async function createRefreshToken(user) {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  await db.query(
    "INSERT INTO user_refresh_tokens (user_id, jti, expires_at) VALUES($1, $2, NOW() + INTERVAL '7 days')",
    [user.id, token],
  );

  return token;
}

module.exports = {
  createTestUser,
  createAccessToken,
  createRefreshToken,
};
