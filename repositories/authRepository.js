const db = require("../database/db");

async function createNewUser(email, password, displayName, userName) {
  const query = await db.query(
    `
        INSERT INTO users(email, password, name, user_name) VALUES ($1, $2, $3, $4) RETURNING *;    
    `,
    [email, password, displayName, userName],
  );

  return query.rows[0];
}

async function isUserNameTaken(userName) {
  const query = await db.query("SELECT * FROM users WHERE user_name = $1", [
    userName,
  ]);

  return query.rowCount > 0;
}

async function isRefreshTokenValid(token) {
  const client = await db.connect();

  try {
    await client.query("BEGIN;");

    const refreshToken = await client.query(
      "SELECT * FROM user_refresh_tokens WHERE token = $1",
      [token],
    );

    const expiresAt = new Date(refreshToken.rows[0].expires_at);

    const now = Date.now();

    if (expiresAt < now) {
      await client.query("DELETE FROM user_refresh_tokens WHERE token = $1", [
        token,
      ]);

      await client.query("COMMIT;");

      return false;
    }

    return true;
  } catch (error) {
    await client.query("ROLLBACK;");
  } finally {
    await client.release();
  }
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

async function storeRefreshToken(userId, token) {
  await db.query(
    "INSERT INTO user_refresh_tokens (user_id, token, expires_at) VALUES($1, $2, NOW() + INTERVAL '7d')",
    [userId, token],
  );
}

module.exports = {
  createNewUser,
  isRefreshTokenValid,
  findUser,
  storeRefreshToken,
  deleteRefreshToken,
  isUserNameTaken,
};
