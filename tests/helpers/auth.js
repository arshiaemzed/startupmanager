const jwt = require("jsonwebtoken");
const db = require("../../database/db");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");

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

module.exports = {
  createTestUser,
  createAccessToken,
};
