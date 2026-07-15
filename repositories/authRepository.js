const { database } = require("pg/lib/defaults");
const db = require("../database/db");

async function createNewUser(email, password, displayName, userName) {
  const query = await db.query(
    `
        INSERT INTO users(email, password, name, user_name) VALUES ($1, $2, $3, $4);    
    `,
    [email, password, displayName, userName],
  );

  return {
    name: displayName,
    email: email,
    password: password,
    userName: userName,
  };
}

async function isUserNameTaken(userName) {
  const query = await db.query("SELECT * FROM users WHERE user_name = $1", [
    userName,
  ]);

  return query.rowCount > 0;
}

async function isRefreshTokenValid(token) {
  const found = await db.query(
    "SELECT * FROM user_refresh_tokens WHERE token = $1",
    [token],
  );

  return found.rowCount > 0;
}

async function deleteRefreshToken(token) {
  const found = await db.query(
    "DELETE FROM user_refresh_tokens WHERE  token = $1",
    [token],
  );

  return found.rowCount > 0;
}

async function findUser(email) {
  const query = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  return query.rows[0];
}

async function selectAllUsers() {
  const text = "SELECT email AS user_email FROM users";

  const query = await db.query(text);

  return query.rows;
}

async function storeRefreshToken(userId, token) {
  const query = await db.query(
    "INSERT INTO user_refresh_tokens (user_id, token, expires_at) VALUES($1, $2, NOW() + INTERVAL '7 days')",
    [userId, token],
  );
  return { message: "User token stored successfully" };
}

module.exports = {
  createNewUser,
  isRefreshTokenValid,
  findUser,
  selectAllUsers,
  storeRefreshToken,
  deleteRefreshToken,
  isUserNameTaken,
};
