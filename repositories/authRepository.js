const AppError = require("../customErrors");
const db = require("../database/db");
const errorCodes = require("../utils/errorCodes");

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

async function isRefreshTokenValid(jti) {
  const query = await db.query(
    "SELECT id FROM user_refresh_tokens WHERE jti = $1 AND expires_at > NOW();",
    [jti],
  );

  return query.rowCount > 0;
}

async function rotateRefreshToken(userId, oldJTI, newJTI) {
  const client = await db.connect();

  try {
    await client.query("BEGIN;");

    const deletedToken = await client.query(
      "DELETE FROM user_refresh_tokens WHERE user_id = $1 AND jti = $2 RETURNING *;",
      [userId, oldJTI],
    );

    if (deletedToken.rowCount !== 1) {
      throw new AppError(
        500,
        errorCodes.FAILED_TO_DELETE_REFRESH_TOKEN,
        "Failed to delete the refresh token.",
      );
    }

    await client.query(
      "INSERT INTO user_refresh_tokens(user_id, jti, expires_at) VALUES($1, $2, NOW() + INTERVAL '7d');",
      [userId, newJTI],
    );

    await client.query("COMMIT;");
  } catch (err) {
    await client.query("ROLLBACK;");
    throw err;
  } finally {
    await client.release();
  }
}

async function deleteRefreshToken(jti) {
  const query = await db.query(
    "DELETE FROM user_refresh_tokens WHERE jti = $1 RETURNING *;",
    [jti],
  );

  return query.rows[0];
}

async function findUser(email) {
  const query = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  return query.rows[0];
}

async function storeRefreshToken(userId, jti) {
  await db.query(
    "INSERT INTO user_refresh_tokens(user_id, jti, expires_at) VALUES($1, $2, NOW() + INTERVAL '7d')",
    [userId, jti],
  );
}

module.exports = {
  createNewUser,
  isRefreshTokenValid,
  findUser,
  storeRefreshToken,
  rotateRefreshToken,
  deleteRefreshToken,
  isUserNameTaken,
};
