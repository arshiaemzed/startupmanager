const db = require("../database/db");

async function createNewUser(email, password) {
  const query = await db.query(
    `
        INSERT INTO users(email, password) VALUES ($1, $2);    
    `,
    [email, password],
  );

  return { email: email, password: password };
}

async function isRefreshTokenValid(userId, token) {
  const found = await db.query(
    "SELECT * FROM user_refresh_tokens WHERE user_id = $1 AND token = $2",
    [userId, token],
  );

  return found.rowCount > 0;
}

async function deleteRefreshToken(userId, token) {
  const found = await db.query(
    "DELETE FROM user_refresh_tokens WHERE user_id = $1 AND token = $2",
    [userId, token],
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
};
