const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");

const { createTestUser, createAccessToken } = require("./auth");

async function createTestStartup() {
  const user = await createTestUser();
  const token = await createAccessToken(user.id);

  const client = await db.connect();

  try {
    await client.query("BEGIN;");

    const startupQuery = await client.query(
      `
        INSERT INTO startups 
        (owner, name, description)
        VALUES($1, $2, $3)
        RETURNING *;
    `,
      [user.id, "test startup", "test"],
    );

    const userQuery = await client.query(
      `
        INSERT INTO startup_users
        (startup_id, user_id, role)
        VALUES($1, $2, $3)
        RETURNING *;
    `,
      [startupQuery.rows[0].id, user.id, "owner"],
    );

    await client.query("COMMIT;");

    return { user: user, token: token, startup: startupQuery.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    await client.release();
  }
}

module.exports = createTestStartup;
