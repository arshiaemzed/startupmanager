const db = require("../../database/db");

async function cleanDatabase() {
  const result = await db.query("SELECT current_database()");

  const databaseName = result.rows[0].current_database;

  if (databaseName != "startup_manager_test") {
    throw new Error(
      `Fatal mistake: the tests are connected to production database`,
    );
  }

  await db.query(
    `TRUNCATE TABLE
        tasks, 
        invites, 
        startup_users,
        startups, 
        user_refresh_tokens, 
        users 
        RESTART IDENTITY 
    CASCADE;`,
  );
}

module.exports = cleanDatabase;
