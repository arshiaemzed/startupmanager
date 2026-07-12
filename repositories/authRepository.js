const db = require("../database/db");

async function createNewUser(email, password, displayName) {
  const query = await db.query(
    `
        INSERT INTO users(email, password, name) VALUES ($1, $2, $3);    
    `,
    [email, password, displayName],
  );

  return { name: displayName, email: email, password: password };
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
};
