const db = require("../../database/db");

async function createTestStartup(name, description) {
  const query = await db.query(
    `
        INSERT INTO startups 
        (name, description)
        VALUES($1, $2)
        RETURNING *;
    `,
    [name, description],
  );

  return query.rows[0];
}

module.exports = {
  createTestStartup,
};
